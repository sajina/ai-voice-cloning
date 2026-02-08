from django.test import TestCase
from .models import VoiceProfile

class VoiceProfileTests(TestCase):
    def test_create_voice_profile(self):
        """Test creating a voice profile."""
        profile = VoiceProfile.objects.create(
            name='Test Voice',
            gender='male',
            emotion='neutral',
            language='en'
        )
        
        self.assertEqual(str(profile), 'Test Voice (male, neutral)')
        self.assertTrue(profile.is_active)
        
    def test_voice_profile_defaults(self):
        """Test default values for voice profile."""
        profile = VoiceProfile.objects.create(name='Default Voice', gender='female')
        
        self.assertEqual(profile.language, 'en')
        self.assertEqual(profile.emotion, 'neutral')
        self.assertFalse(profile.is_premium)
