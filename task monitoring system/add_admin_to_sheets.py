"""
Script to add admin user to Google Sheets
Run this to create/update admin user in Google Sheets
"""
from dotenv import load_dotenv
import os
import requests
from werkzeug.security import generate_password_hash

# Load environment variables
load_dotenv()

# Get Google Sheets Web App URL
web_app_url = os.getenv('GOOGLE_SHEETS_WEB_APP_URL')

if not web_app_url:
    print("ERROR: GOOGLE_SHEETS_WEB_APP_URL not found in .env file")
    print("Please set GOOGLE_SHEETS_WEB_APP_URL in your .env file")
    exit(1)

# Admin credentials
admin_username = 'admin'
admin_email = 'epsilonsystem25@gmail.com'
admin_password = 'R1s2h3h4'
admin_role = 'admin'

# Hash the password
hashed_password = generate_password_hash(admin_password)

print(f"Adding admin user to Google Sheets...")
print(f"Email: {admin_email}")
print(f"Password: {admin_password}")
print(f"Web App URL: {web_app_url}")
print()

# Prepare the request
payload = {
    'action': 'signup',
    'username': admin_username,
    'email': admin_email,
    'password': hashed_password,
    'role': admin_role,
    'user_id': 1  # Use ID 1 for admin
}

try:
    response = requests.post(web_app_url, json=payload, timeout=10)
    
    if response.status_code == 200:
        result = response.json()
        if result.get('success'):
            print("✅ Admin user created/updated successfully in Google Sheets!")
            print(f"   User ID: {result.get('user', {}).get('id')}")
            print(f"   Username: {result.get('user', {}).get('username')}")
            print(f"   Email: {result.get('user', {}).get('email')}")
            print(f"   Role: {result.get('user', {}).get('role')}")
        else:
            error = result.get('error', 'Unknown error')
            if 'already exists' in error.lower():
                print("⚠️  Admin user already exists. Updating...")
                # Try to update by deleting and recreating
                # Note: You may need to manually update in Google Sheets
                print("   Please manually update the admin user in Google Sheets:")
                print(f"   - Email: {admin_email}")
                print(f"   - Password: {hashed_password}")
                print(f"   - Role: {admin_role}")
            else:
                print(f"❌ Error: {error}")
    else:
        print(f"❌ HTTP Error {response.status_code}")
        print(f"   Response: {response.text}")
        
except Exception as e:
    print(f"❌ Error connecting to Google Sheets: {str(e)}")
    print()
    print("Make sure:")
    print("1. Google Apps Script is deployed as Web App")
    print("2. GOOGLE_SHEETS_WEB_APP_URL is correct in .env file")
    print("3. Web App has 'Anyone' access")

