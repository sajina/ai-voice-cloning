"""
Django settings for AI Voice Cloning application.
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import dj_database_url

# Use PyMySQL as MySQL driver (for Windows compatibility)
try:
    import pymysql
    pymysql.version_info = (2, 2, 1, "final", 0)  # Fake mysqlclient version
    pymysql.install_as_MySQLdb()
except ImportError:
    pass

# Patch to allow older MariaDB versions (e.g. 10.4) on local env
# Django 5 requires MariaDB 10.6+, but we want to support local 10.4
try:
    from django.db.backends.mysql import base as mysql_base
    original_check = mysql_base.DatabaseWrapper.check_database_version_supported

    def patched_check_version(self):
        try:
            original_check(self)
        except Exception:
            # Bypass version check for local development
            pass
            
    mysql_base.DatabaseWrapper.check_database_version_supported = patched_check_version
    
    # Patch feature flag to disable RETURNING clause (not supported in MariaDB < 10.5)
    # Django 5 enables this by default for MariaDB, causing 1064 syntax errors on 10.4
    from django.db.backends.mysql.features import DatabaseFeatures
    DatabaseFeatures.can_return_columns_from_insert = False
except ImportError:
    pass

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-this-in-production')
ENVIRONMENT = os.getenv('ENVIRONMENT', 'production')

if ENVIRONMENT == 'development':
    DEBUG = True
    ALLOWED_HOSTS = ['*']
else:
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    ALLOWED_HOSTS = ['*']
    
    # Production Security Settings
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

    CSRF_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SAMESITE = "None"

CSRF_TRUSTED_ORIGINS = [
    "https://aivoice.up.railway.app",
    "https://aivoiceadmin.up.railway.app",
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    # Local apps
    'apps.users',
    'apps.voices',
    'apps.payments',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Serve static files in production
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database configuration
# Railway provides DATABASE_URL automatically when you add a database service
# We map MYSQL_URL to DATABASE_URL if present, or use default DATABASE_URL
DATABASE_URL = os.getenv('MYSQL_URL', os.getenv('DATABASE_URL'))
MYSQL_LOCALLY = os.getenv('MYSQL_LOCALLY', 'False').lower() == 'true'

if MYSQL_LOCALLY:
    # Local MySQL configuration
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('MYSQL_DATABASE', 'ai_voice_db'),
            'USER': os.getenv('MYSQLUSER', 'root'),
            'PASSWORD': os.getenv('MYSQL_ROOT_PASSWORD', ''),
            'HOST': os.getenv('MYSQLHOST', 'localhost'),
            'PORT': os.getenv('MYSQLPORT', '3306'),
            'OPTIONS': {
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            },
        }
    }
elif DATABASE_URL:
    # Railway/Production: Use DATABASE_URL
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    # Local development fallback: Use SQLite (simpler, no driver issues)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Whitenoise for serving static files in production
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

# Media files
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://aivoice.up.railway.app",
]
CORS_ALLOW_CREDENTIALS = True

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False').lower() == 'true'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)
