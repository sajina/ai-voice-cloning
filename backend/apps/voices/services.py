"""
Voice generation service using edge-tts (Microsoft Edge TTS).
Provides high-quality neural voices with support for multiple genders and languages.
"""

import os
import uuid
import asyncio
import edge_tts
from django.conf import settings

# Mapping of Voice Profile attributes to Edge TTS ShortNames
# Format: (Gender, Language, Emotion) -> Voice ShortName
# Emotion support is limited in free API, so we map to specific character voices where possible.

VOICE_MAP = {
    # English - Multiple Variants
    ('male', 'en', 'neutral'): 'en-US-GuyNeural',
    ('male', 'en', 'happy'): 'en-US-ChristopherNeural',
    ('male', 'en', 'excited'): 'en-US-EricNeural',
    ('female', 'en', 'neutral'): 'en-US-AriaNeural',
    ('female', 'en', 'happy'): 'en-US-JennyNeural',
    ('female', 'en', 'calm'): 'en-US-MichelleNeural',
    
    # Spanish
    ('male', 'es', 'neutral'): 'es-ES-AlvaroNeural',
    ('female', 'es', 'neutral'): 'es-ES-ElviraNeural',
    
    # French
    ('male', 'fr', 'neutral'): 'fr-FR-HenriNeural',
    ('female', 'fr', 'neutral'): 'fr-FR-DeniseNeural',
    
    # German
    ('male', 'de', 'neutral'): 'de-DE-ConradNeural',
    ('female', 'de', 'neutral'): 'de-DE-KatjaNeural',
    
    # Portuguese
    ('male', 'pt', 'neutral'): 'pt-BR-AntonioNeural',
    ('female', 'pt', 'neutral'): 'pt-BR-FranciscaNeural',
    
    # Italian
    ('male', 'it', 'neutral'): 'it-IT-DiegoNeural',
    ('female', 'it', 'neutral'): 'it-IT-ElsaNeural',
    
    # Russian
    ('male', 'ru', 'neutral'): 'ru-RU-DmitryNeural',
    ('female', 'ru', 'neutral'): 'ru-RU-SvetlanaNeural',
    
    # Japanese
    ('male', 'ja', 'neutral'): 'ja-JP-KeitaNeural',
    ('female', 'ja', 'neutral'): 'ja-JP-NanamiNeural',
    
    # Korean
    ('male', 'ko', 'neutral'): 'ko-KR-InJoonNeural',
    ('female', 'ko', 'neutral'): 'ko-KR-SunHiNeural',
    
    # Chinese
    ('male', 'zh', 'neutral'): 'zh-CN-YunxiNeural',
    ('female', 'zh', 'neutral'): 'zh-CN-XiaoxiaoNeural',
    
    # Hindi
    ('male', 'hi', 'neutral'): 'hi-IN-MadhurNeural',
    ('female', 'hi', 'neutral'): 'hi-IN-SwaraNeural',
    
    # Bengali
    ('male', 'bn', 'neutral'): 'bn-IN-BashkarNeural',
    ('female', 'bn', 'neutral'): 'bn-IN-TanishaaNeural',
    
    # Tamil
    ('male', 'ta', 'neutral'): 'ta-IN-ValluvarNeural',
    ('female', 'ta', 'neutral'): 'ta-IN-PallaviNeural',
    
    # Telugu
    ('male', 'te', 'neutral'): 'te-IN-MohanNeural',
    ('female', 'te', 'neutral'): 'te-IN-ShrutiNeural',
    
    # Marathi
    ('male', 'mr', 'neutral'): 'mr-IN-ManoharNeural',
    ('female', 'mr', 'neutral'): 'mr-IN-AarohiNeural',
    
    # Gujarati
    ('male', 'gu', 'neutral'): 'gu-IN-NiranjanNeural',
    ('female', 'gu', 'neutral'): 'gu-IN-DhwaniNeural',
    
    # Kannada
    ('male', 'kn', 'neutral'): 'kn-IN-GaganNeural',
    ('female', 'kn', 'neutral'): 'kn-IN-SapnaNeural',
    
    # Malayalam
    ('male', 'ml', 'neutral'): 'ml-IN-MidhunNeural',
    ('female', 'ml', 'neutral'): 'ml-IN-SobhanaNeural',
    
    # Punjabi
    ('male', 'pa', 'neutral'): 'pa-IN-GurbaniNeural',
    ('female', 'pa', 'neutral'): 'pa-IN-GurbaniNeural',
    
    # Urdu
    ('male', 'ur', 'neutral'): 'ur-PK-AsadNeural',
    ('female', 'ur', 'neutral'): 'ur-PK-UzmaNeural',
    
    # Thai
    ('male', 'th', 'neutral'): 'th-TH-NiwatNeural',
    ('female', 'th', 'neutral'): 'th-TH-PremwadeeNeural',
    
    # Vietnamese
    ('male', 'vi', 'neutral'): 'vi-VN-NamMinhNeural',
    ('female', 'vi', 'neutral'): 'vi-VN-HoaiMyNeural',
    
    # Indonesian
    ('male', 'id', 'neutral'): 'id-ID-ArdiNeural',
    ('female', 'id', 'neutral'): 'id-ID-GadisNeural',
    
    # Malay
    ('male', 'ms', 'neutral'): 'ms-MY-OsmanNeural',
    ('female', 'ms', 'neutral'): 'ms-MY-YasminNeural',
    
    # Filipino
    ('male', 'fil', 'neutral'): 'fil-PH-AngeloNeural',
    ('female', 'fil', 'neutral'): 'fil-PH-BlessicaNeural',
    
    # Burmese
    ('male', 'my', 'neutral'): 'my-MM-ThihaNeural',
    ('female', 'my', 'neutral'): 'my-MM-NilarNeural',
    
    # Arabic
    ('male', 'ar', 'neutral'): 'ar-SA-HamedNeural',
    ('female', 'ar', 'neutral'): 'ar-SA-ZariyahNeural',
    
    # Hebrew
    ('male', 'he', 'neutral'): 'he-IL-AvriNeural',
    ('female', 'he', 'neutral'): 'he-IL-HilaNeural',
    
    # Persian
    ('male', 'fa', 'neutral'): 'fa-IR-FaridNeural',
    ('female', 'fa', 'neutral'): 'fa-IR-DilaraNeural',
    
    # Turkish
    ('male', 'tr', 'neutral'): 'tr-TR-AhmetNeural',
    ('female', 'tr', 'neutral'): 'tr-TR-EmelNeural',
    
    # Dutch
    ('male', 'nl', 'neutral'): 'nl-NL-MaartenNeural',
    ('female', 'nl', 'neutral'): 'nl-NL-ColetteNeural',
    
    # Polish
    ('male', 'pl', 'neutral'): 'pl-PL-MarekNeural',
    ('female', 'pl', 'neutral'): 'pl-PL-ZofiaNeural',
    
    # Swedish
    ('male', 'sv', 'neutral'): 'sv-SE-MattiasNeural',
    ('female', 'sv', 'neutral'): 'sv-SE-SofieNeural',
    
    # Danish
    ('male', 'da', 'neutral'): 'da-DK-JeppeNeural',
    ('female', 'da', 'neutral'): 'da-DK-ChristelNeural',
    
    # Norwegian
    ('male', 'no', 'neutral'): 'nb-NO-FinnNeural',
    ('female', 'no', 'neutral'): 'nb-NO-PernilleNeural',
    
    # Finnish
    ('male', 'fi', 'neutral'): 'fi-FI-HarriNeural',
    ('female', 'fi', 'neutral'): 'fi-FI-NooraNeural',
    
    # Greek
    ('male', 'el', 'neutral'): 'el-GR-NestorasNeural',
    ('female', 'el', 'neutral'): 'el-GR-AthinaNeural',
    
    # Czech
    ('male', 'cs', 'neutral'): 'cs-CZ-AntoninNeural',
    ('female', 'cs', 'neutral'): 'cs-CZ-VlastaNeural',
    
    # Hungarian
    ('male', 'hu', 'neutral'): 'hu-HU-TamasNeural',
    ('female', 'hu', 'neutral'): 'hu-HU-NoemiNeural',
    
    # Romanian
    ('male', 'ro', 'neutral'): 'ro-RO-EmilNeural',
    ('female', 'ro', 'neutral'): 'ro-RO-AlinaNeural',
    
    # Ukrainian
    ('male', 'uk', 'neutral'): 'uk-UA-OstapNeural',
    ('female', 'uk', 'neutral'): 'uk-UA-PolinaNeural',
    
    # Bulgarian
    ('male', 'bg', 'neutral'): 'bg-BG-BorislavNeural',
    ('female', 'bg', 'neutral'): 'bg-BG-KalinaNeural',
    
    # Slovak
    ('male', 'sk', 'neutral'): 'sk-SK-LukasNeural',
    ('female', 'sk', 'neutral'): 'sk-SK-ViktoriaNeural',
    
    # Croatian
    ('male', 'hr', 'neutral'): 'hr-HR-SreckoNeural',
    ('female', 'hr', 'neutral'): 'hr-HR-GabrijelaNeural',
    
    # Slovenian
    ('male', 'sl', 'neutral'): 'sl-SI-RokNeural',
    ('female', 'sl', 'neutral'): 'sl-SI-PetraNeural',
    
    # Lithuanian
    ('male', 'lt', 'neutral'): 'lt-LT-LeonasNeural',
    ('female', 'lt', 'neutral'): 'lt-LT-OnaNeural',
    
    # Latvian
    ('male', 'lv', 'neutral'): 'lv-LV-NilsNeural',
    ('female', 'lv', 'neutral'): 'lv-LV-EveritaNeural',
    
    # Estonian
    ('male', 'et', 'neutral'): 'et-EE-KertNeural',
    ('female', 'et', 'neutral'): 'et-EE-AnuNeural',
    
    # Catalan
    ('male', 'ca', 'neutral'): 'ca-ES-EnricNeural',
    ('female', 'ca', 'neutral'): 'ca-ES-JoanaNeural',
    
    # Irish
    ('male', 'ga', 'neutral'): 'ga-IE-ColmNeural',
    ('female', 'ga', 'neutral'): 'ga-IE-OrlaNeural',
    
    # Welsh
    ('male', 'cy', 'neutral'): 'cy-GB-AledNeural',
    ('female', 'cy', 'neutral'): 'cy-GB-NiaNeural',
    
    # Swahili
    ('male', 'sw', 'neutral'): 'sw-KE-RafikiNeural',
    ('female', 'sw', 'neutral'): 'sw-KE-ZuriNeural',
    
    # Afrikaans
    ('male', 'af', 'neutral'): 'af-ZA-WillemNeural',
    ('female', 'af', 'neutral'): 'af-ZA-AdriNeural',
    
    # Amharic
    ('male', 'am', 'neutral'): 'am-ET-AmehaNeural',
    ('female', 'am', 'neutral'): 'am-ET-MekdesNeural',
    
    # Zulu
    ('male', 'zu', 'neutral'): 'zu-ZA-ThembaNeural',
    ('female', 'zu', 'neutral'): 'zu-ZA-ThandoNeural',
}

# Fallback voices by language (gender-neutral fallback)
LANGUAGE_FALLBACKS = {
    'en': 'en-US-AriaNeural', 'es': 'es-ES-ElviraNeural', 'fr': 'fr-FR-DeniseNeural',
    'de': 'de-DE-KatjaNeural', 'pt': 'pt-BR-FranciscaNeural', 'it': 'it-IT-ElsaNeural',
    'ru': 'ru-RU-SvetlanaNeural', 'ja': 'ja-JP-NanamiNeural', 'ko': 'ko-KR-SunHiNeural',
    'zh': 'zh-CN-XiaoxiaoNeural', 'hi': 'hi-IN-SwaraNeural', 'bn': 'bn-IN-TanishaaNeural',
    'ta': 'ta-IN-PallaviNeural', 'te': 'te-IN-ShrutiNeural', 'mr': 'mr-IN-AarohiNeural',
    'gu': 'gu-IN-DhwaniNeural', 'kn': 'kn-IN-SapnaNeural', 'ml': 'ml-IN-SobhanaNeural',
    'pa': 'pa-IN-GurbaniNeural', 'ur': 'ur-PK-UzmaNeural', 'th': 'th-TH-PremwadeeNeural',
    'vi': 'vi-VN-HoaiMyNeural', 'id': 'id-ID-GadisNeural', 'ms': 'ms-MY-YasminNeural',
    'fil': 'fil-PH-BlessicaNeural', 'my': 'my-MM-NilarNeural', 'ar': 'ar-SA-ZariyahNeural',
    'he': 'he-IL-HilaNeural', 'fa': 'fa-IR-DilaraNeural', 'tr': 'tr-TR-EmelNeural',
    'nl': 'nl-NL-ColetteNeural', 'pl': 'pl-PL-ZofiaNeural', 'sv': 'sv-SE-SofieNeural',
    'da': 'da-DK-ChristelNeural', 'no': 'nb-NO-PernilleNeural', 'fi': 'fi-FI-NooraNeural',
    'el': 'el-GR-AthinaNeural', 'cs': 'cs-CZ-VlastaNeural', 'hu': 'hu-HU-NoemiNeural',
    'ro': 'ro-RO-AlinaNeural', 'uk': 'uk-UA-PolinaNeural', 'bg': 'bg-BG-KalinaNeural',
    'sk': 'sk-SK-ViktoriaNeural', 'hr': 'hr-HR-GabrijelaNeural', 'sl': 'sl-SI-PetraNeural',
    'lt': 'lt-LT-OnaNeural', 'lv': 'lv-LV-EveritaNeural', 'et': 'et-EE-AnuNeural',
    'ca': 'ca-ES-JoanaNeural', 'ga': 'ga-IE-OrlaNeural', 'cy': 'cy-GB-NiaNeural',
    'sw': 'sw-KE-ZuriNeural', 'af': 'af-ZA-AdriNeural', 'am': 'am-ET-MekdesNeural',
    'zu': 'zu-ZA-ThandoNeural',
}

class VoiceGenerationService:
    """Service for generating speech using edge-tts."""
    
    def __init__(self):
        self.media_root = settings.MEDIA_ROOT
        self.output_dir = os.path.join(self.media_root, 'generated_audio')
        os.makedirs(self.output_dir, exist_ok=True)
    
    def get_voice_shortname(self, profile=None, clone=None):
        """Determine the best Edge TTS voice based on profile or clone."""
        # If it's a clone, allow a deterministic random voice from the available list
        if clone:
            # Create a list of all available voices
            available_voices = list(set(VOICE_MAP.values()))
            available_voices.sort() # Ensure consistent order
            
            # Use clone ID to deterministically pick a voice
            # This ensures the same clone always gets the same voice
            idx = clone.id % len(available_voices)
            return available_voices[idx]

        if not profile:
            return 'en-US-AriaNeural' # Default fallback
            
        gender = getattr(profile, 'gender', 'female').lower()
        language = getattr(profile, 'language', 'en').lower()
        emotion = getattr(profile, 'emotion', 'neutral').lower()
        
        # Try exact match
        key = (gender, language, emotion)
        if key in VOICE_MAP:
            return VOICE_MAP[key]
            
        # Try match with neutral emotion
        key = (gender, language, 'neutral')
        if key in VOICE_MAP:
            return VOICE_MAP[key]
            
        # Use language fallback
        if language in LANGUAGE_FALLBACKS:
            return LANGUAGE_FALLBACKS[language]
        
        return 'en-US-AriaNeural' # Ultimate fallback

    def generate_speech(self, text, voice_profile=None, voice_clone=None):
        """
        Generate speech from text using edge-tts.
        """
        voice_shortname = self.get_voice_shortname(voice_profile, voice_clone)
        
        # Generate unique filename
        filename = f"{uuid.uuid4().hex}.mp3"
        filepath = os.path.join(self.output_dir, filename)
        
        try:
            # edge-tts is async, so we need to run it in an event loop
            async def _generate():
                communicate = edge_tts.Communicate(text, voice_shortname)
                await communicate.save(filepath)
            
            asyncio.run(_generate())
            
            # Get actual duration (optional)
            duration = len(text) / (150 * 5 / 60) # Fallback estimate
            try:
                from mutagen.mp3 import MP3
                audio = MP3(filepath)
                duration = audio.info.length
            except:
                pass
                
        except Exception as e:
            print(f"EdgeTTS Error: {e}")
            import traceback
            traceback.print_exc()
            # If fail, try to create empty file or generic error handling
            with open(filepath, 'wb') as f:
                f.write(b'')
            duration = 0
            
        return {
            'audio_path': f'generated_audio/{filename}',
            'duration': round(duration, 2)
        }
    
    def process_voice_clone(self, voice_clone):
        # ... existing code ...
        voice_clone.status = 'ready'
        voice_clone.save()
        return voice_clone

voice_service = VoiceGenerationService()
