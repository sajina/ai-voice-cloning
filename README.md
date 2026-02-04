# AI Voice Cloning

AI-powered text-to-speech application with voice cloning capabilities, translation support, and multi-language synthesis.

## Features

- 🎤 **Voice Profiles** - 140+ voice characters across 55 languages
- 🔊 **Text-to-Speech** - High-quality speech synthesis using Edge TTS
- 🌍 **Translation** - Translate text to 55+ languages before speech generation
- 👤 **Voice Cloning** - Create custom voice profiles
- 📜 **History** - Track all generated audio files
- 🔐 **Authentication** - User registration and JWT-based auth
- 👨‍💼 **Admin Dashboard** - Manage users and monitor usage

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TailwindCSS, shadcn/ui |
| Backend | Django, Django REST Framework |
| Database | MySQL |
| TTS Engine | Microsoft Edge TTS |
| Translation | Google Translate (deep-translator) |

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=mysql://user:pass@localhost:3306/voiceai
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## License

MIT License
