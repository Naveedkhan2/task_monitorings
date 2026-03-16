"""
Test script to check if all dependencies are installed and app can start
"""
import sys

print("=" * 60)
print("Testing Task Monitoring System Setup")
print("=" * 60)
print()

# Check Python version
print(f"Python version: {sys.version}")
print()

# Check required modules
modules = [
    'flask',
    'flask_cors',
    'werkzeug',
    'jwt',
    'sqlite3'
]

print("Checking dependencies...")
missing = []
for module in modules:
    try:
        if module == 'flask_cors':
            __import__('flask_cors')
        elif module == 'jwt':
            __import__('jwt')
        else:
            __import__(module)
        print(f"✓ {module} - OK")
    except ImportError as e:
        print(f"✗ {module} - MISSING")
        missing.append(module)

print()

if missing:
    print("ERROR: Missing dependencies!")
    print(f"Please install: pip install {' '.join(missing)}")
    sys.exit(1)

# Try to import app
print("Testing app import...")
try:
    import app
    print("✓ App imported successfully")
except Exception as e:
    print(f"✗ Error importing app: {e}")
    sys.exit(1)

print()
print("=" * 60)
print("All checks passed! You can run: python app.py")
print("=" * 60)

