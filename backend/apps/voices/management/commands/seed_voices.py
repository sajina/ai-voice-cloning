"""
Management command to seed voice profiles for all supported languages.
Run with: python manage.py seed_voices
"""

from django.core.management.base import BaseCommand
from apps.voices.models import VoiceProfile


class Command(BaseCommand):
    help = 'Seed voice profiles for all supported languages'

    def handle(self, *args, **options):
        # Voice profiles to create: (name, gender, language, emotion)
        voices = [
            # English
            ('Emily', 'female', 'en', 'neutral'),
            ('James', 'male', 'en', 'neutral'),
            ('Sophie', 'female', 'en', 'happy'),
            ('Michael', 'male', 'en', 'calm'),
            
            # Spanish
            ('Isabella', 'female', 'es', 'neutral'),
            ('Carlos', 'male', 'es', 'neutral'),
            
            # French
            ('Camille', 'female', 'fr', 'neutral'),
            ('Louis', 'male', 'fr', 'neutral'),
            
            # German
            ('Anna', 'female', 'de', 'neutral'),
            ('Felix', 'male', 'de', 'neutral'),
            
            # Portuguese
            ('Maria', 'female', 'pt', 'neutral'),
            ('Pedro', 'male', 'pt', 'neutral'),
            
            # Italian
            ('Giulia', 'female', 'it', 'neutral'),
            ('Marco', 'male', 'it', 'neutral'),
            
            # Russian
            ('Svetlana', 'female', 'ru', 'neutral'),
            ('Dmitry', 'male', 'ru', 'neutral'),
            
            # Japanese
            ('Yuki', 'female', 'ja', 'neutral'),
            ('Kenji', 'male', 'ja', 'neutral'),
            
            # Korean
            ('Minji', 'female', 'ko', 'neutral'),
            ('Joon', 'male', 'ko', 'neutral'),
            
            # Chinese
            ('Xiaoxiao', 'female', 'zh', 'neutral'),
            ('Yunxi', 'male', 'zh', 'neutral'),
            
            # Hindi
            ('Swara', 'female', 'hi', 'neutral'),
            ('Madhur', 'male', 'hi', 'neutral'),
            
            # Bengali
            ('Tanisha', 'female', 'bn', 'neutral'),
            ('Bashkar', 'male', 'bn', 'neutral'),
            
            # Tamil
            ('Pallavi', 'female', 'ta', 'neutral'),
            ('Valluvar', 'male', 'ta', 'neutral'),
            
            # Telugu
            ('Shruti', 'female', 'te', 'neutral'),
            ('Mohan', 'male', 'te', 'neutral'),
            
            # Marathi
            ('Aarohi', 'female', 'mr', 'neutral'),
            ('Manohar', 'male', 'mr', 'neutral'),
            
            # Gujarati
            ('Dhwani', 'female', 'gu', 'neutral'),
            ('Niranjan', 'male', 'gu', 'neutral'),
            
            # Kannada
            ('Sapna', 'female', 'kn', 'neutral'),
            ('Gagan', 'male', 'kn', 'neutral'),
            
            # Malayalam
            ('Sobhana', 'female', 'ml', 'neutral'),
            ('Midhun', 'male', 'ml', 'neutral'),
            
            # Punjabi
            ('Gurbani', 'female', 'pa', 'neutral'),
            ('Harman', 'male', 'pa', 'neutral'),
            
            # Urdu
            ('Uzma', 'female', 'ur', 'neutral'),
            ('Asad', 'male', 'ur', 'neutral'),
            
            # Thai
            ('Premwadee', 'female', 'th', 'neutral'),
            ('Niwat', 'male', 'th', 'neutral'),
            
            # Vietnamese
            ('Hoai My', 'female', 'vi', 'neutral'),
            ('Nam Minh', 'male', 'vi', 'neutral'),
            
            # Indonesian
            ('Gadis', 'female', 'id', 'neutral'),
            ('Ardi', 'male', 'id', 'neutral'),
            
            # Malay
            ('Yasmin', 'female', 'ms', 'neutral'),
            ('Osman', 'male', 'ms', 'neutral'),
            
            # Filipino
            ('Blessica', 'female', 'fil', 'neutral'),
            ('Angelo', 'male', 'fil', 'neutral'),
            
            # Burmese
            ('Nilar', 'female', 'my', 'neutral'),
            ('Thiha', 'male', 'my', 'neutral'),
            
            # Arabic
            ('Zariyah', 'female', 'ar', 'neutral'),
            ('Hamed', 'male', 'ar', 'neutral'),
            
            # Hebrew
            ('Hila', 'female', 'he', 'neutral'),
            ('Avri', 'male', 'he', 'neutral'),
            
            # Persian
            ('Dilara', 'female', 'fa', 'neutral'),
            ('Farid', 'male', 'fa', 'neutral'),
            
            # Turkish
            ('Emel', 'female', 'tr', 'neutral'),
            ('Ahmet', 'male', 'tr', 'neutral'),
            
            # Dutch
            ('Colette', 'female', 'nl', 'neutral'),
            ('Maarten', 'male', 'nl', 'neutral'),
            
            # Polish
            ('Zofia', 'female', 'pl', 'neutral'),
            ('Marek', 'male', 'pl', 'neutral'),
            
            # Swedish
            ('Sofie', 'female', 'sv', 'neutral'),
            ('Mattias', 'male', 'sv', 'neutral'),
            
            # Danish
            ('Christel', 'female', 'da', 'neutral'),
            ('Jeppe', 'male', 'da', 'neutral'),
            
            # Norwegian
            ('Pernille', 'female', 'no', 'neutral'),
            ('Finn', 'male', 'no', 'neutral'),
            
            # Finnish
            ('Noora', 'female', 'fi', 'neutral'),
            ('Harri', 'male', 'fi', 'neutral'),
            
            # Greek
            ('Athina', 'female', 'el', 'neutral'),
            ('Nestoras', 'male', 'el', 'neutral'),
            
            # Czech
            ('Vlasta', 'female', 'cs', 'neutral'),
            ('Antonin', 'male', 'cs', 'neutral'),
            
            # Hungarian
            ('Noemi', 'female', 'hu', 'neutral'),
            ('Tamas', 'male', 'hu', 'neutral'),
            
            # Romanian
            ('Alina', 'female', 'ro', 'neutral'),
            ('Emil', 'male', 'ro', 'neutral'),
            
            # Ukrainian
            ('Polina', 'female', 'uk', 'neutral'),
            ('Ostap', 'male', 'uk', 'neutral'),
            
            # Bulgarian
            ('Kalina', 'female', 'bg', 'neutral'),
            ('Borislav', 'male', 'bg', 'neutral'),
            
            # Slovak
            ('Viktoria', 'female', 'sk', 'neutral'),
            ('Lukas', 'male', 'sk', 'neutral'),
            
            # Croatian
            ('Gabrijela', 'female', 'hr', 'neutral'),
            ('Srecko', 'male', 'hr', 'neutral'),
            
            # Slovenian
            ('Petra', 'female', 'sl', 'neutral'),
            ('Rok', 'male', 'sl', 'neutral'),
            
            # Lithuanian
            ('Ona', 'female', 'lt', 'neutral'),
            ('Leonas', 'male', 'lt', 'neutral'),
            
            # Latvian
            ('Everita', 'female', 'lv', 'neutral'),
            ('Nils', 'male', 'lv', 'neutral'),
            
            # Estonian
            ('Anu', 'female', 'et', 'neutral'),
            ('Kert', 'male', 'et', 'neutral'),
            
            # Catalan
            ('Joana', 'female', 'ca', 'neutral'),
            ('Enric', 'male', 'ca', 'neutral'),
            
            # Irish
            ('Orla', 'female', 'ga', 'neutral'),
            ('Colm', 'male', 'ga', 'neutral'),
            
            # Welsh
            ('Nia', 'female', 'cy', 'neutral'),
            ('Aled', 'male', 'cy', 'neutral'),
            
            # Swahili
            ('Zuri', 'female', 'sw', 'neutral'),
            ('Rafiki', 'male', 'sw', 'neutral'),
            
            # Afrikaans
            ('Adri', 'female', 'af', 'neutral'),
            ('Willem', 'male', 'af', 'neutral'),
            
            # Amharic
            ('Mekdes', 'female', 'am', 'neutral'),
            ('Ameha', 'male', 'am', 'neutral'),
            
            # Zulu
            ('Thando', 'female', 'zu', 'neutral'),
            ('Themba', 'male', 'zu', 'neutral'),
        ]

        created_count = 0
        for name, gender, language, emotion in voices:
            profile, created = VoiceProfile.objects.get_or_create(
                name=name,
                language=language,
                defaults={
                    'gender': gender,
                    'emotion': emotion,
                    'description': f'{name} - {gender.title()} voice in {language.upper()}',
                    'is_active': True,
                    'is_premium': False,
                }
            )
            if created:
                created_count += 1
                self.stdout.write(f'Created: {name} ({language})')

        self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} voice profiles'))
