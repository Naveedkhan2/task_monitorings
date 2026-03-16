"""Script to check if user password exists in Google Sheets"""
from dotenv import load_dotenv
import os
import requests

load_dotenv()
url = os.getenv('GOOGLE_SHEETS_WEB_APP_URL')

# Test email
email = 'saadbaighabibiag@gmail.com'

print(f"Checking user: {email}")
print(f"Google Sheets URL: {url[:50]}...")
print()

# Get user by email
test_data = {'action': 'get_user', 'email': email}
try:
    r = requests.post(url, json=test_data, timeout=10)
    print(f"Status: {r.status_code}")
    data = r.json()
    print(f"Response: {data}")
    print()
    
    if data.get('success'):
        user = data.get('user', {})
        password = user.get('password', '')
        if password:
            print(f"✅ Password exists (length: {len(password)})")
            print(f"   Password preview: {password[:30]}...")
        else:
            print("❌ Password is EMPTY in Google Sheets!")
            print("   This user needs to sign up again or the password needs to be set.")
    else:
        print(f"❌ User not found: {data.get('error')}")
except Exception as e:
    print(f"❌ Error: {e}")

