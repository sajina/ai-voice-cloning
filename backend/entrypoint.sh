#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
# Bind to 0.0.0.0:$PORT
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 4 --threads 2
