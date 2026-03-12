# app/services/gemini_client.py
import os
import hashlib
import json
import re
from datetime import datetime, timedelta
from typing import List, Optional
from google import genai

class GeminiClient:
    def __init__(self):
        # Load all API keys from environment - these are now from DIFFERENT projects
        self.api_keys = self._load_api_keys()
        self.key_usage = {key: 0 for key in self.api_keys}
        self.key_last_used = {key: None for key in self.api_keys}
        self.key_clients = {}  # Cache clients for each key
        self.key_failure_count = {key: 0 for key in self.api_keys}  # Track failures
        
        # Simple in-memory cache
        self.cache = {}
        self.cache_ttl = 86400  # Cache for 24 hours (increased from 1 hour)
        
        # Model ID
        self.model_id = "gemini-3-flash-preview"
        
    def _load_api_keys(self) -> List[str]:
        """Load all Gemini API keys from environment variables"""
        keys = []
        i = 1
        while True:
            key = os.getenv(f'GEMINI_API_KEY_{i}')
            if not key:
                break
            keys.append(key)
            i += 1
        
        # If no numbered keys found, try the default
        if not keys and os.getenv('GEMINI_API_KEY'):
            keys.append(os.getenv('GEMINI_API_KEY'))
            
        if not keys:
            print("Warning: No Gemini API keys found in environment variables")
            return []
            
        print(f"Loaded {len(keys)} Gemini API keys from different projects")
        return keys
    
    def _get_client(self, api_key):
        """Get or create a client for the given API key"""
        if api_key not in self.key_clients:
            self.key_clients[api_key] = genai.Client(api_key=api_key)
        return self.key_clients[api_key]
    
    def _get_cache_key(self, destinations, days, preferences) -> str:
        """Generate a cache key from the request parameters"""
        cache_str = f"{'-'.join(sorted(destinations))}-{days}-{'-'.join(sorted(preferences))}"
        return hashlib.md5(cache_str.encode()).hexdigest()
    
    def _get_from_cache(self, cache_key: str) -> Optional[dict]:
        """Get cached response if it exists and is not expired"""
        if cache_key in self.cache:
            cached_data, timestamp = self.cache[cache_key]
            if datetime.now() - timestamp < timedelta(seconds=self.cache_ttl):
                print(f"✅ Cache hit for key: {cache_key}")
                return cached_data
            else:
                del self.cache[cache_key]
        return None
    
    def _add_to_cache(self, cache_key: str, data: dict):
        """Add response to cache"""
        self.cache[cache_key] = (data, datetime.now())
        print(f"💾 Added to cache: {cache_key}")
    
    def _get_next_key(self) -> Optional[str]:
        """Smart key selection - picks the key with least failures and usage"""
        if not self.api_keys:
            return None
        
        # Filter out keys that have failed too many times (temporarily)
        available_keys = [k for k in self.api_keys if self.key_failure_count.get(k, 0) < 3]
        
        if not available_keys:
            # If all keys have failed, reset failure counts and try again
            print("⚠️ All keys have failures, resetting failure counts")
            self.key_failure_count = {key: 0 for key in self.api_keys}
            available_keys = self.api_keys
        
        # Find keys with minimum usage
        min_usage = min(self.key_usage.get(k, 0) for k in available_keys)
        candidates = [k for k in available_keys if self.key_usage.get(k, 0) == min_usage]
        
        # Among least used, pick the one least recently used
        if len(candidates) > 1:
            with_usage = [(k, self.key_last_used.get(k) or datetime.min) for k in candidates]
            least_recent = min(with_usage, key=lambda x: x[1])[0]
            return least_recent
        
        return candidates[0] if candidates else None
    
    def generate_itinerary(self, destinations: list, days: int, preferences: list):
        """Generate itinerary with cross-project key rotation"""
        
        # Check cache first
        cache_key = self._get_cache_key(destinations, days, preferences)
        cached_result = self._get_from_cache(cache_key)
        if cached_result:
            return cached_result
        
        if not self.api_keys:
            print("⚠️ No API keys available, returning fallback")
            return self._create_fallback_itinerary(destinations, days, preferences)
        
        # Create prompt
        destinations_str = " → ".join(destinations)
        preferences_str = ", ".join(preferences)
        
        prompt = f"""
        Create a {days}-day travel itinerary for a trip to: {destinations_str}.
        Preferences: {preferences_str}.
        
        Return ONLY a JSON object with this exact structure:
        {{
          "plan": [
            {{
              "day": 1,
              "summary": "Brief summary of the day",
              "activities": ["activity1", "activity2", "activity3"]
            }}
          ]
        }}
        
        Make it detailed and engaging. Distribute the days across the cities appropriately.
        """
        
        # Try keys in rotation
        last_error = None
        attempted_keys = set()
        max_attempts = len(self.api_keys) * 2  # Allow retrying after reset
        
        for attempt in range(max_attempts):
            key = self._get_next_key()
            if not key or key in attempted_keys:
                if len(attempted_keys) >= len(self.api_keys):
                    # We've tried all keys, maybe reset failures?
                    if attempt < max_attempts - 1:
                        print("🔄 Resetting failure counts to try all keys again")
                        self.key_failure_count = {k: 0 for k in self.api_keys}
                        attempted_keys = set()
                        continue
                    break
                continue
            
            attempted_keys.add(key)
            
            try:
                client = self._get_client(key)
                
                # Track usage
                self.key_usage[key] = self.key_usage.get(key, 0) + 1
                self.key_last_used[key] = datetime.now()
                
                # Get project name from key prefix (you could map this)
                key_prefix = key[:8]
                print(f"🌍 Using key from Project {key_prefix}... (usage: {self.key_usage[key]})")
                
                response = client.models.generate_content(
                    model=self.model_id,
                    contents=prompt,
                )
                
                # Parse response
                try:
                    response_text = response.text
                    clean_text = response_text.replace('```json', '').replace('```', '').strip()
                    itinerary_data = json.loads(clean_text)
                    itinerary_data["preferences"] = preferences
                    
                    # Success! Reset failure count for this key
                    self.key_failure_count[key] = 0
                    
                    # Cache the result
                    self._add_to_cache(cache_key, itinerary_data)
                    
                    return itinerary_data
                    
                except json.JSONDecodeError:
                    # Try regex fallback
                    json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
                    if json_match:
                        try:
                            itinerary_data = json.loads(json_match.group())
                            itinerary_data["preferences"] = preferences
                            self.key_failure_count[key] = 0
                            self._add_to_cache(cache_key, itinerary_data)
                            return itinerary_data
                        except:
                            pass
                    
                    raise Exception("Failed to parse response")
                
            except Exception as e:
                error_str = str(e)
                print(f"❌ Error with key {key[:8]}...: {error_str[:100]}")
                last_error = e
                
                # Track failure
                self.key_failure_count[key] = self.key_failure_count.get(key, 0) + 1
                
                # If quota exceeded, increment usage to make it less likely to be chosen
                if "429" in error_str or "quota" in error_str.lower() or "RESOURCE_EXHAUSTED" in error_str:
                    print(f"⚠️ Quota exceeded for key {key[:8]}... (from project {key[:8]})")
                    self.key_usage[key] = self.key_usage.get(key, 0) + 100  # Make it seem highly used
                    
                    # Extract retry time if available
                    retry_match = re.search(r'retryDelay["\s:]+(\d+)s', error_str)
                    if retry_match:
                        retry_seconds = int(retry_match.group(1))
                        print(f"⏱️  Key {key[:8]}... suggests retry in {retry_seconds}s")
                
                continue
        
        # All keys failed
        print(f"❌ All API keys from all projects failed. Last error: {last_error}")
        return self._create_fallback_itinerary(destinations, days, preferences)
    
    def _create_fallback_itinerary(self, destinations, days, preferences):
        """Create a fallback itinerary when API fails"""
        fallback_plan = []
        for i in range(days):
            city_index = min(i, len(destinations) - 1)
            current_city = destinations[city_index]
            
            fallback_plan.append({
                "day": i + 1,
                "summary": f"Day {i+1}: Exploring {current_city}",
                "activities": [
                    f"Morning: Visit main attractions in {current_city}",
                    "Afternoon: Try local cuisine",
                    "Evening: Cultural experience"
                ]
            })
        
        return {
            "plan": fallback_plan,
            "preferences": preferences,
            "note": "Sample itinerary (AI service busy - try again later)"
        }
    
    def get_key_stats(self):
        """Get statistics about key usage across projects"""
        return {
            "total_keys": len(self.api_keys),
            "total_projects": len(set([k[:8] for k in self.api_keys])),
            "key_usage": {k[:8] + "...": v for k, v in self.key_usage.items()},
            "key_failures": {k[:8] + "...": v for k, v in self.key_failure_count.items()},
            "cache_size": len(self.cache)
        }

# Create a singleton instance
gemini_client = GeminiClient()