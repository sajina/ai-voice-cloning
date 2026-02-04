from django.db import models
from django.conf import settings


class VoiceProfile(models.Model):
    """System voice profiles for speech generation."""
    
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    EMOTION_CHOICES = [
        ('neutral', 'Neutral'),
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('angry', 'Angry'),
        ('excited', 'Excited'),
        ('calm', 'Calm'),
    ]
    
    LANGUAGE_CHOICES = [
        # Major Languages
        ('en', 'English'),
        ('es', 'Spanish'),
        ('fr', 'French'),
        ('de', 'German'),
        ('pt', 'Portuguese'),
        ('it', 'Italian'),
        ('ru', 'Russian'),
        ('ja', 'Japanese'),
        ('ko', 'Korean'),
        ('zh', 'Chinese'),
        # South Asian
        ('hi', 'Hindi'),
        ('bn', 'Bengali'),
        ('ta', 'Tamil'),
        ('te', 'Telugu'),
        ('mr', 'Marathi'),
        ('gu', 'Gujarati'),
        ('kn', 'Kannada'),
        ('ml', 'Malayalam'),
        ('pa', 'Punjabi'),
        ('ur', 'Urdu'),
        # Southeast Asian
        ('th', 'Thai'),
        ('vi', 'Vietnamese'),
        ('id', 'Indonesian'),
        ('ms', 'Malay'),
        ('fil', 'Filipino'),
        ('my', 'Burmese'),
        # Middle Eastern
        ('ar', 'Arabic'),
        ('he', 'Hebrew'),
        ('fa', 'Persian'),
        ('tr', 'Turkish'),
        # European
        ('nl', 'Dutch'),
        ('pl', 'Polish'),
        ('sv', 'Swedish'),
        ('da', 'Danish'),
        ('no', 'Norwegian'),
        ('fi', 'Finnish'),
        ('el', 'Greek'),
        ('cs', 'Czech'),
        ('hu', 'Hungarian'),
        ('ro', 'Romanian'),
        ('uk', 'Ukrainian'),
        ('bg', 'Bulgarian'),
        ('sk', 'Slovak'),
        ('hr', 'Croatian'),
        ('sl', 'Slovenian'),
        ('lt', 'Lithuanian'),
        ('lv', 'Latvian'),
        ('et', 'Estonian'),
        ('ca', 'Catalan'),
        ('ga', 'Irish'),
        ('cy', 'Welsh'),
        # African
        ('sw', 'Swahili'),
        ('af', 'Afrikaans'),
        ('am', 'Amharic'),
        ('zu', 'Zulu'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    emotion = models.CharField(max_length=20, choices=EMOTION_CHOICES, default='neutral')
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='en')
    sample_audio = models.FileField(upload_to='voice_samples/', null=True, blank=True)
    preview_image = models.ImageField(upload_to='voice_previews/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'voice_profiles'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.gender}, {self.emotion})"


class VoiceClone(models.Model):
    """User's cloned voice profiles."""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='voice_clones'
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    audio_sample = models.FileField(upload_to='clone_samples/')
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('processing', 'Processing'),
            ('ready', 'Ready'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'voice_clones'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} (by {self.user.email})"


class GeneratedSpeech(models.Model):
    """Generated speech records."""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='generated_speeches'
    )
    voice_profile = models.ForeignKey(
        VoiceProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='generated_speeches'
    )
    voice_clone = models.ForeignKey(
        VoiceClone,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='generated_speeches'
    )
    input_text = models.TextField()
    audio_file = models.FileField(upload_to='generated_audio/')
    duration_seconds = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'generated_speeches'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Speech by {self.user.email} - {self.created_at}"
