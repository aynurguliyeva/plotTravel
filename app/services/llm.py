# app/services/llm.py
import os
import json
import re
from google import genai
from fastapi import HTTPException
from .gemini_client import gemini_client

# Keep the original function for backward compatibility
def generate_ai_itinerary_single_key(destination: str, days: int, preferences: list):
    """
    Original implementation using a single API key
    """
    model_id = "gemini-3-flash-preview" 
    
    prompt = f"""
    Create a {days}-day travel itinerary for {destination}.
    Preferences: {', '.join(preferences)}.
    Return ONLY a JSON object:
    {{
      "destination": "{destination}",
      "plan": [
        {{"day": 1, "activities": ["Activity A", "Activity B"], "summary": "..."}}
      ]
    }}
    """
    
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        response = client.models.generate_content(
            model=model_id,
            contents=prompt,
        )
        
        clean_text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_text)
        
    except Exception as e:
        print(f"Gemini 3 API Error: {e}")
        raise HTTPException(status_code=500, detail="AI generation failed.")

# New function that supports multiple destinations and key rotation
def generate_ai_itinerary(destinations: list, days: int, preferences: list):
    """
    Generate itinerary with multi-destination support, key rotation, and caching
    """
    try:
        # Use the gemini_client for key rotation and caching
        result = gemini_client.generate_itinerary(destinations, days, preferences)
        
        # Add destination string for backward compatibility
        destination_str = " → ".join(destinations)
        result["destination"] = destination_str
        
        return result
        
    except Exception as e:
        print(f"All API keys failed: {e}")
        
        # Fallback response with proper structure
        destination_str = " → ".join(destinations)
        
        # Create a basic fallback itinerary
        fallback_plan = []
        for i in range(days):
            # Distribute cities across days
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
        
        fallback_response = {
            "destination": destination_str,
            "plan": fallback_plan,
            "preferences": preferences,
            "note": "This is a fallback itinerary due to AI service unavailability"
        }
        
        return fallback_response

# Optional: Function to clear cache (useful for testing)
def clear_itinerary_cache():
    """Clear the itinerary cache"""
    if hasattr(gemini_client, 'cache'):
        gemini_client.cache.clear()
        return {"message": "Cache cleared"}
    return {"message": "No cache found"}

# Optional: Function to get key stats
def get_api_key_stats():
    """Get statistics about API key usage"""
    return gemini_client.get_key_stats()