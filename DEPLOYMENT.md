# AI Voice Cloning - Deployment Guide

## Quick Overview

| Component | Technology | Port |
|-----------|------------|------|
| Backend | Django + Gunicorn | 8000 |
| Frontend | React (Vite build) | 80/443 |
| Database | MySQL | 3306 |
| Reverse Proxy | Nginx | 80/443 |

---

## Option 1: VPS Deployment (DigitalOcean, AWS EC2, Linode)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3.11 python3.11-venv python3-pip nginx mysql-server nodejs npm git -y
```

### Step 2: Clone Project

```bash
cd /var/www
git clone <your-repo-url> aivoicepython
cd aivoicepython
```

### Step 3: Backend Setup

```bash
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Create .env file
cp .env.example .env
nano .env
```

**Edit `.env` file:**
```env
DEBUG=False
SECRET_KEY=your-super-secret-key-here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=mysql://user:password@localhost:3306/voiceai
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

```bash
# Run migrations
python manage.py migrate
python manage.py collectstatic --noinput

# Create superuser
python manage.py createsuperuser
```

### Step 4: Frontend Build

```bash
cd /var/www/aivoicepython/frontend

# Install dependencies
npm install

# Create production .env
echo "VITE_API_URL=https://yourdomain.com" > .env.production

# Build for production
npm run build
```

### Step 5: Gunicorn Service

Create `/etc/systemd/system/voiceai.service`:

```ini
[Unit]
Description=VoiceAI Django Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/aivoicepython/backend
Environment="PATH=/var/www/aivoicepython/backend/venv/bin"
ExecStart=/var/www/aivoicepython/backend/venv/bin/gunicorn --workers 3 --bind unix:/run/voiceai.sock config.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl start voiceai
sudo systemctl enable voiceai
```

### Step 6: Nginx Configuration

Create `/etc/nginx/sites-available/voiceai`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (React build)
    location / {
        root /var/www/aivoicepython/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://unix:/run/voiceai.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Media files (generated audio)
    location /media/ {
        alias /var/www/aivoicepython/backend/media/;
    }

    # Static files
    location /static/ {
        alias /var/www/aivoicepython/backend/staticfiles/;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/voiceai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL Certificate (Free)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option 2: Railway / Render (Easy PaaS)

### Railway Deployment

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → Deploy from GitHub
4. Add MySQL database from Railway
5. Set environment variables
6. Deploy!

### Render Deployment

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create Web Service for backend
4. Create Static Site for frontend
5. Add MySQL database
6. Deploy!

---

## Option 3: Docker Deployment

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: voiceai
      MYSQL_USER: voiceai
      MYSQL_PASSWORD: password
      MYSQL_ROOT_PASSWORD: rootpassword
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
      - media_data:/app/media
    environment:
      - DEBUG=False
      - DATABASE_URL=mysql://voiceai:password@db:3306/voiceai
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
  media_data:
```

### Backend Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt gunicorn
COPY . .

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

---

## Environment Variables Checklist

| Variable | Description | Example |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | `django-insecure-xxx` |
| `DEBUG` | Debug mode | `False` |
| `ALLOWED_HOSTS` | Allowed domains | `yourdomain.com` |
| `DATABASE_URL` | Database connection | `mysql://user:pass@host:3306/db` |
| `CORS_ALLOWED_ORIGINS` | Frontend URL | `https://yourdomain.com` |
| `VITE_API_URL` | Backend API URL | `https://yourdomain.com` |

---

## Post-Deployment Checklist

- [ ] SSL certificate installed
- [ ] Database migrations run
- [ ] Static files collected
- [ ] Media directory writable
- [ ] Environment variables set
- [ ] Superuser created
- [ ] Firewall configured (ports 80, 443 open)
- [ ] Backup strategy in place
