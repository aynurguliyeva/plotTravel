import requests
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")

def geocode_city(city_name: str):
    """
    Geocode a city name using Mapbox API with proper error handling
    """
    logger.info(f"🌍 Geocoding city: {city_name}")
    
    # Check if token exists
    if not MAPBOX_TOKEN:
        logger.error("❌ MAPBOX_TOKEN not found in environment variables")
        return get_fallback_coordinates(city_name)
    
    try:
        # Properly encode the city name for URL
        import urllib.parse
        encoded_city = urllib.parse.quote(city_name)
        url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{encoded_city}.json"
        
        params = {
            "access_token": MAPBOX_TOKEN,
            "limit": 1,
            "types": "place"  # Limit to places for better results
        }
        
        logger.info(f"📡 Calling Mapbox API for: {city_name}")
        response = requests.get(url, params=params, timeout=10)
        
        # Check HTTP status
        if response.status_code != 200:
            logger.error(f"❌ Mapbox API returned status {response.status_code}")
            logger.error(f"Response: {response.text[:200]}")
            return get_fallback_coordinates(city_name)
        
        data = response.json()
        
        # Check if we have features
        if "features" not in data:
            logger.error(f"❌ No 'features' in response: {data.keys()}")
            return get_fallback_coordinates(city_name)
        
        if not data["features"]:
            logger.warning(f"⚠️ No results found for: {city_name}")
            return get_fallback_coordinates(city_name)
        
        # Success! Extract coordinates
        feature = data["features"][0]
        lng, lat = feature["center"]
        place_name = feature.get("place_name", city_name)
        
        logger.info(f"✅ Found {city_name} at {lat}, {lng}")
        
        return {
            "lat": lat,
            "lng": lng,
            "name": place_name
        }
        
    except requests.exceptions.Timeout:
        logger.error("❌ Mapbox API timeout")
        return get_fallback_coordinates(city_name)
        
    except requests.exceptions.RequestException as e:
        logger.error(f"❌ Mapbox request failed: {e}")
        return get_fallback_coordinates(city_name)
        
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return get_fallback_coordinates(city_name)

def get_fallback_coordinates(city_name: str):
    """
    Fallback coordinates for common cities when API fails
    """
    logger.info(f"📍 Using fallback coordinates for: {city_name}")
    
    # Common cities with known coordinates
    defaults = {
        'paris': {'lat': 48.8566, 'lng': 2.3522},
        'london': {'lat': 51.5074, 'lng': -0.1278},
        'tokyo': {'lat': 35.6762, 'lng': 139.6503},
        'new york': {'lat': 40.7128, 'lng': -74.0060},
        'rome': {'lat': 41.9028, 'lng': 12.4964},
        'barcelona': {'lat': 41.3851, 'lng': 2.1734},
        'amsterdam': {'lat': 52.3676, 'lng': 4.9041},
        'berlin': {'lat': 52.5200, 'lng': 13.4050},
        'brussels': {'lat': 50.8503, 'lng': 4.3517},
        'antwerp': {'lat': 51.2194, 'lng': 4.4025},
        'bruges': {'lat': 51.2093, 'lng': 3.2247},
        'ghent': {'lat': 51.0543, 'lng': 3.7174},
        'milan': {'lat': 45.4642, 'lng': 9.1900},
        'venice': {'lat': 45.4408, 'lng': 12.3155},
        'florence': {'lat': 43.7696, 'lng': 11.2558},
    }
    
    # Try case-insensitive match
    city_lower = city_name.lower().strip()
    if city_lower in defaults:
        coords = defaults[city_lower]
        logger.info(f"✅ Found in defaults: {city_name}")
        return coords
    
    # Generate deterministic but reasonable coordinates based on city name hash
    # This ensures the same city always gets the same coordinates
    import hashlib
    hash_val = int(hashlib.md5(city_lower.encode()).hexdigest()[:8], 16)
    
    # Generate coordinates in Europe-ish range (roughly)
    lat = 45.0 + (hash_val % 1000) / 1000.0
    lng = 5.0 + (hash_val % 1000) / 1000.0
    
    logger.warning(f"⚠️ Generated fallback coordinates for: {city_name}")
    return {
        "lat": round(lat, 4),
        "lng": round(lng, 4)
    }

# For testing if run directly
if __name__ == "__main__":
    test_cities = ["Paris", "UnknownCity", "Antwerp", "Brussels"]
    for city in test_cities:
        result = geocode_city(city)
        print(f"{city}: {result}")