# AI Voice Cloning - Complete Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Frontend Pages](#frontend-pages)
8. [Setup & Installation](#setup--installation)
9. [Configuration](#configuration)
10. [Deployment](#deployment)

---

## Project Overview

**AI Voice Cloning** is a full-stack web application that provides AI-powered text-to-speech capabilities with voice cloning, translation support, and multi-language synthesis.

### Key Features

| Feature | Description |
|---------|-------------|
| 🎤 **Voice Profiles** | 140+ pre-built voice characters across 55 languages |
| 🔊 **Text-to-Speech** | High-quality neural speech synthesis using Microsoft Edge TTS |
| 🌍 **Translation** | Translate text to 55+ languages before speech generation |
| 👤 **Voice Cloning** | Create custom voice profiles from audio samples |
| 📜 **History** | Track all generated audio files with playback and download |
| 🔐 **Authentication** | User registration with JWT-based authentication |
| 👨‍💼 **Admin Dashboard** | Manage users, voices, clones, and monitor usage statistics |

---

## Architecture

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React + Vite)"]
        UI[User Interface]
        Auth[Auth Context]
        API[Axios API Client]
    end
    
    subgraph Backend["Backend (Django REST Framework)"]
        URLs[URL Router]
        Views[API Views]
        Services[Voice Services]
        Models[Database Models]
    end
    
    subgraph External["External Services"]
        EdgeTTS[Microsoft Edge TTS]
        GoogleTranslate[Google Translate]
    end
    
    subgraph Storage["Storage"]
        MySQL[(MySQL Database)]
        Media[Media Files]
    end
    
    UI --> Auth --> API
    API --> URLs --> Views
    Views --> Services
    Views --> Models
    Services --> EdgeTTS
    Services --> GoogleTranslate
    Models --> MySQL
    Services --> Media
```

### Request Flow

1. **User Interface** → React components send requests via Axios
2. **API Layer** → Django REST Framework handles authentication & validation
3. **Business Logic** → Services process requests (TTS generation, translation)
4. **External APIs** → Edge TTS for speech, Google Translate for translations
5. **Storage** → MySQL for data, file system for audio files

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Runtime |
| Django | 4.2.x | Web framework |
| Django REST Framework | 3.14+ | REST API |
| djangorestframework-simplejwt | 5.3+ | JWT authentication |
| django-cors-headers | 4.3+ | CORS handling |
| django-filter | 23.5+ | API filtering |
| edge-tts | 7.0+ | Microsoft Edge TTS |
| deep-translator | 1.11+ | Google Translate wrapper |
| aksharamukha | 2.3+ | Transliteration |
| PyMySQL | 1.1+ | MySQL driver |
| Pillow | 10.0+ | Image processing |
| gunicorn | 21.0+ | WSGI server (production) |
| whitenoise | 6.6+ | Static file serving |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI library |
| Vite | 5.0 | Build tool |
| TailwindCSS | 3.4 | CSS framework |
| React Router | 6.21 | Client-side routing |
| Axios | 1.6 | HTTP client |
| Radix UI | Various | Accessible UI components |
| Lucide React | 0.312 | Icons |
| react-hot-toast | 2.4 | Toast notifications |

### Database

| Technology | Purpose |
|------------|---------|
| MySQL 8.0 | Primary database |
| dj-database-url | Database URL parsing |

---

## Project Structure

```
aivoicepython/
├── backend/                      # Django Backend
│   ├── apps/                     # Django applications
│   │   ├── users/                # User management
│   │   │   ├── models.py         # User model
│   │   │   ├── views.py          # Auth views
│   │   │   ├── serializers.py    # User serializers
│   │   │   └── urls.py           # Auth routes
│   │   └── voices/               # Voice features
│   │       ├── models.py         # Voice, Clone, Speech models
│   │       ├── views.py          # API views
│   │       ├── serializers.py    # Serializers
│   │       ├── services.py       # TTS service (Edge TTS)
│   │       ├── translation.py    # Translation service
│   │       └── urls.py           # Voice routes
│   ├── config/                   # Django config
│   │   ├── settings.py           # Settings
│   │   ├── urls.py               # Root URL config
│   │   └── wsgi.py               # WSGI application
│   ├── media/                    # Uploaded & generated files
│   │   ├── avatars/              # User avatars
│   │   ├── clone_samples/        # Voice clone samples
│   │   └── generated_audio/      # Generated speech files
│   ├── requirements.txt          # Python dependencies
│   ├── manage.py                 # Django CLI
│   └── .env                      # Environment variables
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── api/                  # API client configuration
│   │   ├── components/           # Reusable UI components
│   │   ├── context/              # React contexts (Auth)
│   │   ├── lib/                  # Utility functions
│   │   ├── pages/                # Page components
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   ├── Dashboard.jsx     # User dashboard
│   │   │   ├── VoiceGenerate.jsx # TTS generation
│   │   │   ├── VoiceClone.jsx    # Voice cloning
│   │   │   ├── TextTranslate.jsx # Translation
│   │   │   └── AdminDashboard.jsx# Admin panel
│   │   ├── App.jsx               # Root component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── package.json              # Node dependencies
│   ├── vite.config.js            # Vite configuration
│   └── tailwind.config.js        # Tailwind configuration
│
├── README.md                     # Quick start guide
├── DEPLOYMENT.md                 # Deployment guide
├── DOCUMENTATION.md              # This file
├── Dockerfile                    # Docker configuration
└── railway.toml                  # Railway deployment config
```

---

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    Users ||--o{ VoiceClones : creates
    Users ||--o{ GeneratedSpeeches : generates
    VoiceProfiles ||--o{ GeneratedSpeeches : used_in
    VoiceClones ||--o{ GeneratedSpeeches : used_in
    
    Users {
        bigint id PK
        varchar email UK
        varchar name
        varchar password
        image avatar
        boolean is_active
        boolean is_staff
        boolean is_admin
        datetime created_at
        datetime updated_at
    }
    
    VoiceProfiles {
        bigint id PK
        varchar name
        text description
        enum gender
        enum emotion
        enum language
        file sample_audio
        image preview_image
        boolean is_active
        boolean is_premium
        datetime created_at
        datetime updated_at
    }
    
    VoiceClones {
        bigint id PK
        bigint user_id FK
        varchar name
        text description
        file audio_sample
        enum status
        boolean is_active
        datetime created_at
        datetime updated_at
    }
    
    GeneratedSpeeches {
        bigint id PK
        bigint user_id FK
        bigint voice_profile_id FK
        bigint voice_clone_id FK
        text input_text
        file audio_file
        float duration_seconds
        datetime created_at
    }
```

### Model Details

#### User Model (`apps.users.models.User`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | BigAutoField | Primary key |
| `email` | EmailField | Unique email (username) |
| `name` | CharField | Display name |
| `password` | Hashed | Password (Django auth) |
| `avatar` | ImageField | Profile picture |
| `is_active` | BooleanField | Account active status |
| `is_staff` | BooleanField | Django admin access |
| `is_admin` | BooleanField | Application admin |
| `created_at` | DateTimeField | Registration date |
| `updated_at` | DateTimeField | Last update |

#### VoiceProfile Model (`apps.voices.models.VoiceProfile`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | BigAutoField | Primary key |
| `name` | CharField | Voice name (e.g., "Aria") |
| `description` | TextField | Voice description |
| `gender` | CharField | male/female |
| `emotion` | CharField | neutral/happy/sad/angry/excited/calm |
| `language` | CharField | Language code (55 languages) |
| `sample_audio` | FileField | Sample audio file |
| `preview_image` | ImageField | Avatar/preview image |
| `is_active` | BooleanField | Available for use |
| `is_premium` | BooleanField | Premium tier only |
| `created_at` | DateTimeField | Creation date |

#### VoiceClone Model (`apps.voices.models.VoiceClone`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | BigAutoField | Primary key |
| `user` | ForeignKey | Owner user |
| `name` | CharField | Clone name |
| `description` | TextField | Clone description |
| `audio_sample` | FileField | Uploaded voice sample |
| `status` | CharField | pending/processing/ready/failed |
| `is_active` | BooleanField | Available for use |
| `created_at` | DateTimeField | Upload date |

#### GeneratedSpeech Model (`apps.voices.models.GeneratedSpeech`)

| Field | Type | Description |
|-------|------|-------------|
| `id` | BigAutoField | Primary key |
| `user` | ForeignKey | Generator user |
| `voice_profile` | ForeignKey | Used voice profile (nullable) |
| `voice_clone` | ForeignKey | Used voice clone (nullable) |
| `input_text` | TextField | Original text |
| `audio_file` | FileField | Generated MP3 file |
| `duration_seconds` | FloatField | Audio duration |
| `created_at` | DateTimeField | Generation date |

---

## API Documentation

### Base URL

```
Development: http://localhost:8000/api/
Production:  https://yourdomain.com/api/
```

### Authentication

All endpoints (except register/login) require JWT authentication:

```http
Authorization: Bearer <access_token>
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register/
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepassword123",
    "password_confirm": "securepassword123"
}
```

**Response (201):**
```json
{
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLC...",
        "refresh": "eyJ0eXAiOiJKV1QiLC..."
    }
}
```

#### Login

```http
POST /api/auth/login/
```

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

**Response (200):**
```json
{
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "is_admin": false,
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLC...",
        "refresh": "eyJ0eXAiOiJKV1QiLC..."
    }
}
```

#### Refresh Token

```http
POST /api/auth/refresh/
```

**Request Body:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLC..."
}
```

#### Get/Update Profile

```http
GET /api/auth/profile/
PUT /api/auth/profile/
```

#### Change Password

```http
POST /api/auth/change-password/
```

**Request Body:**
```json
{
    "current_password": "oldpassword",
    "new_password": "newpassword123"
}
```

---

### Voice Endpoints

#### List Voice Profiles

```http
GET /api/voices/profiles/
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `gender` | string | Filter by gender (male/female) |
| `emotion` | string | Filter by emotion |
| `language` | string | Filter by language code |
| `is_premium` | boolean | Filter premium voices |
| `search` | string | Search by name/description |

**Response (200):**
```json
[
    {
        "id": 1,
        "name": "Aria",
        "description": "Friendly female voice",
        "gender": "female",
        "emotion": "neutral",
        "language": "en",
        "language_display": "English",
        "sample_audio": "/media/voice_samples/aria.mp3",
        "preview_image": "/media/voice_previews/aria.jpg",
        "is_premium": false
    }
]
```

#### Get Single Voice Profile

```http
GET /api/voices/profiles/{id}/
```

---

### Voice Clone Endpoints

#### List User's Voice Clones

```http
GET /api/voices/clones/
```

#### Create Voice Clone

```http
POST /api/voices/clones/
Content-Type: multipart/form-data
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Clone name |
| `description` | string | No | Clone description |
| `audio_sample` | file | Yes | Audio file (MP3/WAV) |

#### Get/Update/Delete Clone

```http
GET /api/voices/clones/{id}/
PUT /api/voices/clones/{id}/
DELETE /api/voices/clones/{id}/
```

---

### Speech Generation Endpoints

#### Generate Speech

```http
POST /api/voices/generate/
```

**Request Body:**
```json
{
    "text": "Hello, this is a test of the text to speech system.",
    "voice_profile_id": 1
}
```

Or with voice clone:
```json
{
    "text": "Hello, this is a test of the text to speech system.",
    "voice_clone_id": 5
}
```

**Response (201):**
```json
{
    "id": 42,
    "input_text": "Hello, this is a test...",
    "audio_file": "/media/generated_audio/abc123.mp3",
    "duration_seconds": 3.5,
    "created_at": "2026-02-05T15:30:00Z",
    "voice_profile": {
        "id": 1,
        "name": "Aria"
    }
}
```

#### Speech History

```http
GET /api/voices/history/
DELETE /api/voices/history/{id}/
```

---

### Translation Endpoints

#### Translate Text

```http
POST /api/voices/translate/
```

**Request Body:**
```json
{
    "text": "Hello, how are you?",
    "target_language": "es",
    "source_language": "auto"
}
```

**Response (200):**
```json
{
    "original_text": "Hello, how are you?",
    "translated_text": "Hola, ¿cómo estás?",
    "source_language": "en",
    "target_language": "es"
}
```

---

### Admin Endpoints

> **Note:** All admin endpoints require `is_admin=True` on the user account.

#### Admin Dashboard Statistics

```http
GET /api/voices/admin/dashboard/
```

**Response (200):**
```json
{
    "voice_profiles": {
        "total": 140,
        "active": 135
    },
    "voice_clones": {
        "total": 50,
        "pending": 5,
        "ready": 45
    },
    "generated_speeches": {
        "total": 1500,
        "this_month": 200,
        "this_week": 50
    },
    "top_voices": [...]
}
```

#### Admin User Management

```http
GET /api/auth/admin/users/
GET /api/auth/admin/users/{id}/
PUT /api/auth/admin/users/{id}/
DELETE /api/auth/admin/users/{id}/
```

#### Admin Voice Profile Management

```http
GET /api/voices/admin/profiles/
POST /api/voices/admin/profiles/
PUT /api/voices/admin/profiles/{id}/
DELETE /api/voices/admin/profiles/{id}/
```

#### Admin Voice Clone Management

```http
GET /api/voices/admin/clones/
POST /api/voices/admin/clones/{id}/approve/
POST /api/voices/admin/clones/{id}/reject/
```

---

## Frontend Pages

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Home | Public | Landing page with features |
| `/login` | Login | Guest only | User login form |
| `/register` | Register | Guest only | User registration form |
| `/dashboard` | Dashboard | Authenticated | User dashboard with history |
| `/generate` | VoiceGenerate | Authenticated | Text-to-speech generation |
| `/clone` | VoiceClone | Authenticated | Voice cloning upload |
| `/translate` | TextTranslate | Authenticated | Text translation |
| `/admin` | AdminDashboard | Admin only | Admin management panel |

---

## Setup & Installation

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **MySQL 8.0+**
- **Git**

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file (see Configuration section)
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# 6. Run database migrations
python manage.py migrate

# 7. Create admin user
python manage.py createsuperuser

# 8. Start development server
python manage.py runserver
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# 4. Start development server
npm run dev
```

---

## Configuration

### Backend Environment Variables (`.env`)

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-super-secret-key-change-in-production

# Database (Local MySQL)
DB_NAME=ai_voice_db
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=3306

# OR use DATABASE_URL (Railway/Production)
# DATABASE_URL=mysql://user:password@host:3306/dbname

# Allowed Hosts
ALLOWED_HOSTS=localhost,127.0.0.1

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Environment Variables (`.env`)

```env
VITE_API_URL=http://localhost:8000
```

### Production Environment Variables

```env
DEBUG=False
SECRET_KEY=long-random-secure-string
DATABASE_URL=mysql://user:pass@host:3306/dbname
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

## Deployment

### Quick Deploy Options

| Platform | Difficulty | Cost | Best For |
|----------|------------|------|----------|
| **Railway** | Easy | From $5/mo | Quick deployment |
| **Render** | Easy | Free tier | Small projects |
| **DigitalOcean** | Medium | $5/mo | Full control |
| **AWS EC2** | Hard | Variable | Enterprise |
| **Docker** | Medium | Depends | Containerization |

### Railway Deployment (Recommended)

1. Push code to GitHub
2. Create Railway account at [railway.app](https://railway.app)
3. Create new project → Deploy from GitHub
4. Add MySQL database service
5. Set environment variables:
   - `SECRET_KEY`
   - `DEBUG=False`
   - `ALLOWED_HOSTS`
   - `CORS_ALLOWED_ORIGINS`
6. Deploy!

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

---

## Supported Languages

The application supports 55 languages for voice generation:

| Region | Languages |
|--------|-----------|
| **Major** | English, Spanish, French, German, Portuguese, Italian, Russian, Japanese, Korean, Chinese |
| **South Asian** | Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu |
| **Southeast Asian** | Thai, Vietnamese, Indonesian, Malay, Filipino, Burmese |
| **Middle Eastern** | Arabic, Hebrew, Persian, Turkish |
| **European** | Dutch, Polish, Swedish, Danish, Norwegian, Finnish, Greek, Czech, Hungarian, Romanian, Ukrainian, Bulgarian, Slovak, Croatian, Slovenian, Lithuanian, Latvian, Estonian, Catalan, Irish, Welsh |
| **African** | Swahili, Afrikaans, Amharic, Zulu |

---

## Troubleshooting

### Common Issues

#### ModuleNotFoundError

```bash
pip install -r requirements.txt
```

#### Database Connection Error

1. Ensure MySQL is running
2. Check `.env` database credentials
3. Create the database manually:
   ```sql
   CREATE DATABASE ai_voice_db CHARACTER SET utf8mb4;
   ```

#### CORS Error

Update `CORS_ALLOWED_ORIGINS` in `.env` to include your frontend URL.

#### Static Files Not Loading

```bash
python manage.py collectstatic --noinput
```

---

## License

MIT License - See LICENSE file for details.

---

*Documentation last updated: February 2026*
