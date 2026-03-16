"""Test if role is being read correctly from Google Sheets"""
from dotenv import load_dotenv
import os
import requests
import json

load_dotenv()
url = os.getenv('GOOGLE_SHEETS_WEB_APP_URL')

print("Testing Role Reading from Google Sheets")
print("=" * 60)

# Test get_user action
test_data = {'action': 'get_user', 'email': 'epsilonsystems25@gmail.com'}
r = requests.post(url, json=test_data, timeout=10)
result = r.json()

if result.get('success'):
    user = result.get('user', {})
    role = user.get('role', '')
    
    print(f"✅ User found: {user.get('email')}")
    print(f"   User ID: {user.get('id')}")
    print(f"   Username: {user.get('username')}")
    print(f"   Role: {repr(role)}")
    print(f"   Role type: {type(role)}")
    print(f"   Role value: '{role}'")
    print(f"   Role == 'admin': {role == 'admin'}")
    print(f"   Role.lower() == 'admin': {str(role).lower() == 'admin'}")
    print()
    
    # Check for whitespace or hidden characters
    if role:
        print(f"   Role length: {len(str(role))}")
        print(f"   Role bytes: {repr(role.encode('utf-8'))}")
        print(f"   Role stripped: '{str(role).strip()}'")
        print(f"   Role after strip and lower: '{str(role).strip().lower()}'")
    
    if str(role).strip().lower() != 'admin':
        print()
        print("❌ PROBLEM: Role is not 'admin'!")
        print(f"   Expected: 'admin'")
        print(f"   Got: {repr(role)}")
        print()
        print("This means the Apps Script in Google Sheets might:")
        print("   1. Not be reading Column E (Role) correctly")
        print("   2. Have old code that doesn't include Role column")
        print("   3. Need to be updated with the latest code")
else:
    print(f"❌ Error: {result.get('error')}")

print()
print("=" * 60)

