"""
Translation service using deep-translator library with aksharamukha for transliteration.
Supports translation between 50+ languages using Google Translate.
Uses Aksharamukha for accurate transliteration of names/proper nouns to Indian languages.
"""

from deep_translator import GoogleTranslator
from deep_translator.exceptions import (
    LanguageNotSupportedException,
    TranslationNotFound,
    RequestError,
)

# Try to import aksharamukha for transliteration
try:
    # Python 3.14 compatibility: ast.Str removed
    import ast
    if not hasattr(ast, 'Str'):
        ast.Str = ast.Constant
        
    from aksharamukha import transliterate as akshara_transliterate
    AKSHARAMUKHA_AVAILABLE = True
except ImportError as e:
    AKSHARAMUKHA_AVAILABLE = False
    print(f"Aksharamukha not available, transliteration will use fallback. Error: {e}")

# Language code mapping for Google Translate
LANGUAGE_CODE_MAP = {
    'zh': 'zh-CN',  # Chinese (Simplified)
    'no': 'no',     # Norwegian
    'fil': 'tl',    # Filipino -> Tagalog
}

# Aksharamukha script mapping for Indian languages
AKSHARAMUKHA_SCRIPT_MAP = {
    'ta': 'Tamil',      # Tamil
    'ml': 'Malayalam',  # Malayalam
    'hi': 'Devanagari', # Hindi
    'te': 'Telugu',     # Telugu
    'kn': 'Kannada',    # Kannada
    'mr': 'Devanagari', # Marathi (uses Devanagari)
    'gu': 'Gujarati',   # Gujarati
    'bn': 'Bengali',    # Bengali
    'pa': 'Gurmukhi',   # Punjabi
    'or': 'Oriya',      # Odia
    'sa': 'Devanagari', # Sanskrit
    'si': 'Sinhala',    # Sinhala
    'ne': 'Devanagari', # Nepali
    'th': 'Thai',       # Thai
    'ar': 'Arab',       # Arabic
}


class TranslationService:
    """Service for translating text between languages."""
    
    def __init__(self):
        self.translator = None
    
    def get_supported_languages(self):
        """Get list of supported languages from Google Translate."""
        try:
            return GoogleTranslator().get_supported_languages(as_dict=True)
        except Exception as e:
            print(f"Error getting supported languages: {e}")
            return {}
    
    def _normalize_language_code(self, code):
        """Normalize language code for deep-translator compatibility."""
        if code in LANGUAGE_CODE_MAP:
            return LANGUAGE_CODE_MAP[code]
        return code
    
    def _is_likely_name(self, text):
        """
        Check if the input text is likely a name/proper noun.
        Names are typically: short, no spaces or few words, capitalized, no punctuation.
        """
        text = text.strip()
        words = text.split()
        
        # Short text (1-3 words) is likely a name
        if len(words) <= 3:
            # Check if it looks like a name (starts with capital, mostly letters)
            for word in words:
                if word and word[0].isupper() and word.isalpha():
                    return True
        return False
    
    def _transliterate_with_aksharamukha(self, text, target_language):
        """
        Transliterate text using Aksharamukha (phonetic conversion).
        This is better for names and proper nouns.
        """
        if not AKSHARAMUKHA_AVAILABLE:
            return None
        
        target_script = AKSHARAMUKHA_SCRIPT_MAP.get(target_language)
        if not target_script:
            return None
        
        try:
            # Transliterate from Latin/IAST to target script
            result = akshara_transliterate.process('IAST', target_script, text)
            return result
        except Exception as e:
            print(f"Aksharamukha transliteration failed: {e}")
            # Try with autodetect source
            try:
                result = akshara_transliterate.process('autodetect', target_script, text)
                return result
            except Exception as e2:
                print(f"Aksharamukha autodetect also failed: {e2}")
                return None
    
    def _translate_with_google(self, text, source, target):
        """Translate with Google Translate."""
        try:
            source_code = self._normalize_language_code(source)
            target_code = self._normalize_language_code(target)
            
            translator = GoogleTranslator(source=source_code, target=target_code)
            return translator.translate(text)
        except Exception as e:
            print(f"Google translation failed: {e}")
            return None
    
    def translate(self, text, target_language, source_language='auto'):
        """
        Translate text to target language.
        For names/proper nouns going to Indian languages, uses transliteration.
        
        Args:
            text: The text to translate
            target_language: Target language code (e.g., 'es', 'fr', 'ta')
            source_language: Source language code or 'auto' for auto-detection
        
        Returns:
            dict: {
                'translated_text': str,
                'source_language': str (detected or provided),
                'target_language': str,
                'success': bool,
                'error': str (if any)
            }
        """
        if not text or not text.strip():
            return {
                'translated_text': text,
                'source_language': source_language,
                'target_language': target_language,
                'success': True,
                'error': None
            }
        
        try:
            translated_text = None
            method_used = 'google'
            
            # Check if it's a name going to an Indian language - use transliteration
            is_name = self._is_likely_name(text)
            is_indian_target = target_language in AKSHARAMUKHA_SCRIPT_MAP
            
            if is_name and is_indian_target and AKSHARAMUKHA_AVAILABLE:
                # Use transliteration for names
                transliterated = self._transliterate_with_aksharamukha(text.strip(), target_language)
                if transliterated:
                    translated_text = transliterated
                    method_used = 'transliteration'
            
            # If not a name or transliteration failed, use Google Translate
            if not translated_text:
                translated_text = self._translate_with_google(text, source_language, target_language)
                method_used = 'google'
            
            if translated_text:
                return {
                    'translated_text': translated_text,
                    'source_language': source_language,
                    'target_language': target_language,
                    'success': True,
                    'error': None,
                    'method': method_used
                }
            else:
                return {
                    'translated_text': text,
                    'source_language': source_language,
                    'target_language': target_language,
                    'success': False,
                    'error': 'Translation failed'
                }
            
        except LanguageNotSupportedException as e:
            return {
                'translated_text': text,
                'source_language': source_language,
                'target_language': target_language,
                'success': False,
                'error': f'Language not supported: {str(e)}'
            }
        except TranslationNotFound as e:
            return {
                'translated_text': text,
                'source_language': source_language,
                'target_language': target_language,
                'success': False,
                'error': f'Translation not found: {str(e)}'
            }
        except RequestError as e:
            return {
                'translated_text': text,
                'source_language': source_language,
                'target_language': target_language,
                'success': False,
                'error': f'Translation request failed: {str(e)}'
            }
        except Exception as e:
            return {
                'translated_text': text,
                'source_language': source_language,
                'target_language': target_language,
                'success': False,
                'error': f'Translation error: {str(e)}'
            }
    
    def transliterate(self, text, target_language):
        """
        Pure transliteration (phonetic conversion) without translation.
        Best for names, proper nouns, and when you want the sound preserved.
        """
        if not AKSHARAMUKHA_AVAILABLE:
            return {
                'transliterated_text': text,
                'success': False,
                'error': 'Transliteration not available'
            }
        
        result = self._transliterate_with_aksharamukha(text, target_language)
        if result:
            return {
                'transliterated_text': result,
                'success': True,
                'error': None
            }
        else:
            return {
                'transliterated_text': text,
                'success': False,
                'error': 'Transliteration failed for this language'
            }
    
    def translate_and_generate_payload(self, text, target_language, source_language='auto'):
        """
        Translate text and prepare payload for speech generation.
        Returns the translated text ready for TTS.
        """
        result = self.translate(text, target_language, source_language)
        
        if result['success']:
            return result['translated_text'], None
        else:
            # Return original text with error message
            return text, result['error']


# Singleton instance
translation_service = TranslationService()
