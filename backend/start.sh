#!/bin/sh
set -e

echo "Starting deployment script..."
echo "PORT is set to: $PORT"

echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn on 0.0.0.0:$PORT..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
