"""
Vercel Serverless Function Entry Point
"""
from app import app

# Export the Flask app for Vercel
# Vercel will automatically handle the routing
def handler(request):
    return app(request.environ, lambda status, headers: None)

# For Vercel Python runtime
if __name__ == '__main__':
    app.run()

