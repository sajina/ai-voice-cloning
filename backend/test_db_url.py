import dj_database_url
import os

# Mock the environment variable with the suspicious value
os.environ['DATABASE_URL'] = "${{MySQL.MYSQL_URL}}"

print(f"Testing URL: {os.environ['DATABASE_URL']}")

try:
    config = dj_database_url.config()
    print("Parsed config:", config)
except Exception as e:
    print(f"CRASHED: {e}")
