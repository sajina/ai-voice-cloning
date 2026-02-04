import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.voices.models import VoiceProfile

print(f"Total voice profiles: {VoiceProfile.objects.count()}")
print("\nBy language:")
for lang in ['en', 'hi', 'ta', 'bn', 'ar', 'ja', 'ko', 'zh', 'fr', 'de']:
    count = VoiceProfile.objects.filter(language=lang).count()
    print(f"  {lang}: {count} profiles")

print("\nFirst 10 profiles:")
for p in VoiceProfile.objects.all()[:10]:
    print(f"  - {p.name} ({p.language}, {p.gender})")
