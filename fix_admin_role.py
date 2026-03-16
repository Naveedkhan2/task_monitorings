"""Script to fix admin role in Google Sheets"""
from dotenv import load_dotenv
import os
import requests

load_dotenv()
url = os.getenv('GOOGLE_SHEETS_WEB_APP_URL')

admin_email = 'epsilonsystems25@gmail.com'
admin_user_id = 230397

print("=" * 60)
print("Fixing Admin Role in Google Sheets")
print("=" * 60)
print()

# First, check current user data
print("1. Checking current user data...")
check_data = {'action': 'get_user', 'email': admin_email}
try:
    r = requests.post(url, json=check_data, timeout=10)
    result = r.json()
    
    if result.get('success'):
        user = result.get('user', {})
        current_role = user.get('role', 'unknown')
        current_id = user.get('id')
        print(f"   ✅ User found:")
        print(f"      Email: {admin_email}")
        print(f"      Current Role: {current_role}")
        print(f"      Current User ID: {current_id}")
        print()
        
        if current_role == 'admin':
            print("   ✅ Role is already set to 'admin'!")
            print("   If you're still seeing the user dashboard, try:")
            print("   1. Logout and login again")
            print("   2. Clear browser cache/localStorage")
            exit(0)
        else:
            print(f"   ⚠️  Role is '{current_role}', needs to be 'admin'")
    else:
        print(f"   ❌ User not found: {result.get('error')}")
        exit(1)
except Exception as e:
    print(f"   ❌ Error: {e}")
    exit(1)

# Try to update using update_user action
print("2. Attempting to update role using update_user action...")
update_data = {
    'action': 'update_user',
    'email': admin_email,
    'role': 'admin',
    'user_id': admin_user_id
}

try:
    r = requests.post(url, json=update_data, timeout=10)
    result = r.json()
    
    if result.get('success'):
        print("   ✅ Role updated successfully!")
        print(f"      New Role: {result.get('user', {}).get('role')}")
        print(f"      User ID: {result.get('user', {}).get('id')}")
        print()
        print("   Next steps:")
        print("   1. Logout from the application")
        print("   2. Login again with admin credentials")
        print("   3. You should now see the admin dashboard")
    else:
        error = result.get('error', 'Unknown error')
        if 'Unknown action' in error:
            print(f"   ⚠️  update_user action not available yet")
            print()
            print("   You need to update the Apps Script in Google Sheets first:")
            print("   1. Open your Google Sheet")
            print("   2. Go to Extensions → Apps Script")
            print("   3. Replace ALL code with the updated code from google_apps_script.js")
            print("   4. Save (Ctrl+S)")
            print("   5. Deploy → Manage deployments → Edit → New version → Deploy")
            print()
            print("   OR manually update in Google Sheets:")
            print(f"   1. Open your Google Sheet → SignUp sheet")
            print(f"   2. Find the row with email: {admin_email}")
            print(f"   3. In the 'Role' column (Column E), change it to: admin")
            print(f"   4. In the 'User ID' column (Column A), change it to: {admin_user_id}")
        else:
            print(f"   ❌ Error: {error}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print()
print("=" * 60)

