import urllib.request
import urllib.error
import sys

def check_url(url, name):
    print(f"Checking {name} at {url}...")
    try:
        # Set a timeout of 5 seconds
        with urllib.request.urlopen(url, timeout=5) as response:
            if response.getcode() == 200:
                print(f"✅ {name} is UP")
                return True
            else:
                print(f"❌ {name} returned status {response.getcode()}")
                return False
    except urllib.error.URLError as e:
        print(f"❌ {name} is DOWN or Unreachable: {e.reason}")
        return False
    except Exception as e:
        print(f"❌ {name} Error: {e}")
        return False

if __name__ == "__main__":
    print("=== AI Voice Project Smoke Test ===")
    
    # 1. Check Backend Health
    backend_url = "http://127.0.0.1:8000/api/health/"
    backend_up = check_url(backend_url, "Backend API")
    
    # 2. Check Frontend
    # Note: Frontend might return 404 for / but commonly returns 200 for index.html
    frontend_url = "http://localhost:5173/"
    frontend_up = check_url(frontend_url, "Frontend Dev Server")

    print("\n=== Summary ===")
    if backend_up and frontend_up:
        print("✅ All systems operational.")
        sys.exit(0)
    else:
        print("⚠️  Some systems are down. Ensure you have started the servers.")
        if not backend_up:
            print("   - Backend: `python manage.py runserver`")
        if not frontend_up:
            print("   - Frontend: `npm run dev`")
        sys.exit(1)
