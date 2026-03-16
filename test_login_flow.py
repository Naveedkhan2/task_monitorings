"""Test the complete login flow to debug role issue"""
from dotenv import load_dotenv
import os
import requests
from werkzeug.security import check_password_hash

load_dotenv()
url = os.getenv('GOOGLE_SHEETS_WEB_APP_URL')

print("=" * 60)
print("Testing Login Flow")
print("=" * 60)
print()

# Step 1: Get user by email
print("Step 1: Getting user from Google Sheets...")
get_user_data = {'action': 'get_user', 'email': 'epsilonsystems25@gmail.com'}
r = requests.post(url, json=get_user_data, timeout=10)
result = r.json()

if result.get('success'):
    user = result.get('user', {})
    print(f"✅ User found:")
    print(f"   ID: {user.get('id')}")
    print(f"   Username: {user.get('username')}")
    print(f"   Email: {user.get('email')}")
    print(f"   Role: '{user.get('role')}' (type: {type(user.get('role'))})")
    print(f"   Password exists: {bool(user.get('password'))}")
    print()
    
    # Step 2: Test password verification
    stored_password = user.get('password', '')
    test_password = 'R1s2h3h4'
    
    if stored_password:
        print("Step 2: Testing password verification...")
        is_valid = check_password_hash(stored_password, test_password)
        print(f"   Password valid: {is_valid}")
        print()
        
        if is_valid:
            print("Step 3: Simulating Flask login response...")
            role = user.get('role', 'user')
            # Clean role like Flask does
            if role:
                role = str(role).strip().lower()
            else:
                role = 'user'
            
            print(f"   Cleaned role: '{role}'")
            print(f"   Should show admin dashboard: {role == 'admin'}")
            print()
            
            if role != 'admin':
                print("❌ PROBLEM FOUND!")
                print(f"   Role from Google Sheets: '{user.get('role')}'")
                print(f"   After cleaning: '{role}'")
                print()
                print("Possible issues:")
                print("   1. Role column in Google Sheets might have whitespace")
                print("   2. Apps Script might not be reading Role column correctly")
                print("   3. Apps Script deployment might not be updated")
        else:
            print("❌ Password verification failed!")
    else:
        print("❌ Password is empty in Google Sheets!")
else:
    print(f"❌ Error: {result.get('error')}")

print()
print("=" * 60)

