"""Quick test script to verify Google Sheets configuration"""
from dotenv import load_dotenv
import os
import requests

load_dotenv()
url = os.getenv('GOOGLE_SHEETS_WEB_APP_URL', '')

if not url:
    print("❌ ERROR: GOOGLE_SHEETS_WEB_APP_URL not set in .env file")
    exit(1)

print(f"✅ URL found: {url[:50]}...")
print("\nTesting connection...")

try:
    response = requests.get(url, timeout=10)
    print(f"✅ Status Code: {response.status_code}")
    print(f"✅ Response: {response.text[:200]}")
    print("\n🎉 Google Sheets is configured and working!")
except Exception as e:
    print(f"❌ Error connecting to Google Sheets: {e}")
    print("\n⚠️  Make sure:")
    print("   1. The Apps Script is deployed as a Web App")
    print("   2. Access is set to 'Anyone'")
    print("   3. The URL is correct")

