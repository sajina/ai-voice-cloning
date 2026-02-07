# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies (required for mysqlclient)
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# We do NOT run collectstatic here because it requires DB access/Secret Key.
# We let the Procfile handle it at runtime, or we will set a dummy secret key if needed.

# Expose port (Railway will override this but good for documentation)
EXPOSE 8000

# Command to run the application (Procfile usage is preferred on Railway, but this is a fallback)
CMD python manage.py migrate && python manage.py collectstatic --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
