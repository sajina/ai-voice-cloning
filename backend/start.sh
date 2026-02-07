#!/bin/sh
set -e

# Default PORT if not set
PORT="${PORT:-8000}"

echo "Starting deployment script..."
echo "PORT is set to: $PORT"

echo "Running migrations..."
python manage.py migrate --noinput || echo "WARNING: Migration failed, but continuing..."

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear || echo "WARNING: Collectstatic failed, but continuing..."

echo "Starting Gunicorn on 0.0.0.0:$PORT..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
