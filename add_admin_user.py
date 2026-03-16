"""Script to add admin user to Google Sheets"""
from dotenv import load_dotenv
import os
import requests
from werkzeug.security import generate_password_hash

load_dotenv()
url = os.getenv('GOOGLE_SHEETS_WEB_APP_URL')

# Admin credentials
admin_email = 'epsilonsystems25@gmail.com'
admin_password = 'R1s2h3h4'
admin_username = 'Epsilon Systems'
admin_user_id = 230397

# Hash the password
hashed_password = generate_password_hash(admin_password)
print(f"✅ Password hashed: {hashed_password[:50]}...")
print()

# Prepare signup data with admin role and specific user ID
signup_data = {
    'action': 'signup',
    'username': admin_username,
    'email': admin_email,
    'password': hashed_password,
    'role': 'admin',
    'user_id': admin_user_id  # Specify the user ID
}

print(f"Adding admin user to Google Sheets...")
print(f"  Email: {admin_email}")
print(f"  User ID: {admin_user_id}")
print(f"  Role: admin")
print()

try:
    # First, try to add the user
    response = requests.post(url, json=signup_data, timeout=10)
    result = response.json()
    
    if result.get('success'):
        assigned_id = result.get('user', {}).get('id')
        print("✅ Admin user added successfully!")
        print(f"   User ID assigned: {assigned_id}")
        
        # If ID doesn't match, update it
        if assigned_id != admin_user_id:
            print(f"   Updating User ID to {admin_user_id}...")
            update_data = {
                'action': 'update_user',
                'email': admin_email,
                'user_id': admin_user_id,
                'role': 'admin'
            }
            update_response = requests.post(url, json=update_data, timeout=10)
            update_result = update_response.json()
            if update_result.get('success'):
                print(f"✅ User ID updated to {admin_user_id}")
            else:
                print(f"⚠️  Could not auto-update User ID: {update_result.get('error')}")
                print("   Please manually update it in Google Sheets")
    else:
        error = result.get('error', 'Unknown error')
        if 'already exists' in error.lower():
            print(f"⚠️  User already exists. Updating...")
            # Update existing user
            update_data = {
                'action': 'update_user',
                'email': admin_email,
                'password': hashed_password,
                'role': 'admin',
                'user_id': admin_user_id,
                'username': admin_username
            }
            update_response = requests.post(url, json=update_data, timeout=10)
            update_result = update_response.json()
            if update_result.get('success'):
                print("✅ Admin user updated successfully!")
                print(f"   Email: {admin_email}")
                print(f"   User ID: {admin_user_id}")
                print(f"   Role: admin")
            else:
                print(f"❌ Error updating user: {update_result.get('error')}")
                print()
                print("Manual update instructions:")
                print("   1. Open your Google Sheet")
                print(f"   2. Find the row with email: {admin_email}")
                print(f"   3. Update the Password column with: {hashed_password}")
                print(f"   4. Update the Role column to: admin")
                print(f"   5. Update the User ID to: {admin_user_id}")
        else:
            print(f"❌ Error: {error}")
            
except Exception as e:
    print(f"❌ Error connecting to Google Sheets: {e}")
    print()
    print("Manual setup instructions:")
    print("   1. Open your Google Sheet")
    print("   2. Add a new row with:")
    print(f"      - User ID: {admin_user_id}")
    print(f"      - User Name: {admin_username}")
    print(f"      - Email: {admin_email}")
    print(f"      - Password: {hashed_password}")
    print(f"      - Role: admin")

