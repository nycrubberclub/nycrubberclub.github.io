import requests
import base64
from datetime import datetime, timezone

def lambda_handler(event, context):
    domain_url = 'https://nycrubber.club/'
    json_url = 'https://nycrubber.club/events/event_publication_schedule.json'
    image_url_default = 'https://nycrubber.club/images/NYC_RubberClub_ComingSoon_v4_logo.png'
    datetime_format = '%Y/%m/%d %I:%M %p'

    # get event schedule
    schedule_response = requests.get(json_url)
    if schedule_response.status_code != 200:
        return {
            'statusCode': 400,
            'body': 'Failed to fetch event schedule'
        }

    # Find the valid image entry
    valid_entry = None
    for entry in schedule_response.json().get('events', []):
        try:
            now = datetime.now(timezone.utc)
            startdate_utc = datetime.strptime(entry["datetime_valid_et"], datetime_format).astimezone(timezone.utc)
            enddate_utc = datetime.strptime(entry["datetime_expire_et"], datetime_format).astimezone(timezone.utc)

            if startdate_utc <= now < enddate_utc:
                valid_entry = entry
                print(f"[DEBUG] Found valid entry: {entry}")
                break
                
        except Exception as e:
            print(f"[DEBUG] Failed to parse event source date.  ({entry})")
            print(f"[ERROR] Exception: {e}")

            continue

    if valid_entry:
        image_url = domain_url + valid_entry["url_image"]

        # Fetch the image content
        image_response = requests.get(image_url)
        if image_response.status_code != 200:
            print("[DEBUG] Failed to fetch event image.")
 
            return {
                'statusCode': 400,
                'body': 'Failed to fetch event image'
            }

        if image_response.status_code == 200:
            encoded_image = base64.b64encode(image_response.content).decode('utf-8')

            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": image_response.headers["Content-Type"],
                    "Cache-Control": "no-cache"  # Avoid caching the response on Facebook's end
                },
                "body": encoded_image, #image_response.content,
                "isBase64Encoded": True  # Encode for binary image content
            }

    else:
        print("[DEBUG] No valid event found, using default image.")

        image_response = requests.get(image_url_default)

        if image_response.status_code == 200:
            encoded_image = base64.b64encode(image_response.content).decode('utf-8')

            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": image_response.headers["Content-Type"],
                    "Cache-Control": "no-cache"  # Avoid caching the response on Facebook's end
                },
                "body": encoded_image, #image_response.content,
                "isBase64Encoded": True  # Encode for binary image content
            }
        else:
            print("[DEBUG] Failed to fetch default image.")

            return {
                'statusCode': 400,
                'body': 'Failed to fetch default image'
            }
    

    # No valid image found
    return {
        "statusCode": 404,
        "body": "No valid image found for the current date."
    }


lambda_handler(None, None)