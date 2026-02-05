from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model with email authentication."""
    
    email = models.EmailField(unique=True, max_length=255)
    name = models.CharField(max_length=255)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    credits = models.IntegerField(default=10)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.email
    
    @property
    def is_administrator(self):
        return self.is_admin or self.is_superuser


class EmailOTP(models.Model):
    """Store OTP codes for email verification."""
    
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=255)  # Hashed password
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'email_otps'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"OTP for {self.email}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at
