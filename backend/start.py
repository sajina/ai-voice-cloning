import os
import sys

def run_command(command, ignore_errors=False):
    print(f"Running: {command}")
    ret = os.system(command)
    if ret != 0 and not ignore_errors:
        print(f"Error running command: {command}")
        sys.exit(1)

if __name__ == "__main__":
    print("Starting deployment script (Python)...")
    
    port = os.environ.get("PORT", "8000")
    print(f"PORT is set to: {port}")

    # Run migrations (allow failure)
    run_command("python manage.py migrate --noinput || true", ignore_errors=True)

    # Collect static files (allow failure)
    run_command("python manage.py collectstatic --noinput --clear || true", ignore_errors=True)

    # Start Gunicorn
    gunicorn_cmd = f"gunicorn config.wsgi:application --bind 0.0.0.0:{port} --log-level debug"
    print(f"Executing: {gunicorn_cmd}")
    
    # Use os.execvp to replace the process
    args = gunicorn_cmd.split()
    os.execvp(args[0], args)
