"""Script to update a user's password in Google Sheets"""
from dotenv import load_dotenv
import os
import requests
from werkzeug.security import generate_password_hash

load_dotenv()
url = os.getenv('GOOGLE_SHEETS_WEB_APP_URL')

# User details
email = 'saadbaighabibiag@gmail.com'
new_password = input(f"Enter new password for {email}: ")

if not new_password:
    print("❌ Password cannot be empty!")
    exit(1)

# Hash the password
hashed_password = generate_password_hash(new_password)
print(f"✅ Password hashed: {hashed_password[:50]}...")
print()

# Note: This requires modifying the Apps Script to support password updates
# For now, the user should sign up again or manually update the Google Sheet
print("⚠️  Note: The Apps Script doesn't have an 'update_password' action yet.")
print("   You have two options:")
print("   1. Sign up again with the same email (if allowed)")
print("   2. Manually update the password in Google Sheets")
print()
print("To manually update:")
print(f"   1. Open your Google Sheet")
print(f"   2. Find the row with email: {email}")
print(f"   3. In the Password column, paste this hashed password:")
print(f"   {hashed_password}")

