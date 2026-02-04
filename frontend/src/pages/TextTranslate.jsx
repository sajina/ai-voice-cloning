import { useState, useEffect, useCallback } from 'react';
import { voicesApi } from '@/api/voices';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { Languages, Loader2, Copy, ArrowRightLeft, Sparkles, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { LANGUAGES, getLanguagesByRegion } from '@/lib/languages';
import { franc } from 'franc';

// Map franc ISO 639-3 codes to our ISO 639-1 codes
const FRANC_TO_LANG = {
  'eng': 'en',
  'tam': 'ta',
  'mal': 'ml',
  'hin': 'hi',
  'tel': 'te',
  'kan': 'kn',
  'mar': 'mr',
  'guj': 'gu',
  'ben': 'bn',
  'pan': 'pa',
  'urd': 'ur',
  'spa': 'es',
  'fra': 'fr',
  'deu': 'de',
  'ita': 'it',
  'por': 'pt',
  'rus': 'ru',
  'jpn': 'ja',
  'kor': 'ko',
  'cmn': 'zh',
  'zho': 'zh',
  'ara': 'ar',
  'tha': 'th',
  'vie': 'vi',
  'ind': 'id',
  'msa': 'ms',
  'nld': 'nl',
  'pol': 'pl',
  'tur': 'tr',
  'swe': 'sv',
  'nor': 'no',
  'dan': 'da',
  'fin': 'fi',
  'ces': 'cs',
  'ell': 'el',
  'heb': 'he',
  'ukr': 'uk',
  'ron': 'ro',
  'hun': 'hu',
  'cat': 'ca',
  'bul': 'bg',
  'hrv': 'hr',
  'slk': 'sk',
  'fil': 'fil',
  'tgl': 'fil',
};

export function TextTranslate() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [detectedLanguage, setDetectedLanguage] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState('ta'); // Default to Tamil
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Detect language as user types
  const detectLanguage = useCallback((text) => {
    if (!text || text.trim().length < 10) {
      // Need at least 10 characters for accurate detection
      setDetectedLanguage(null);
      return;
    }

    try {
      // franc returns an array of [lang, confidence] when using franc.all()
      const detected = franc(text.trim(), { minLength: 10 });
      
      if (detected && detected !== 'und') {
        const langCode = FRANC_TO_LANG[detected];
        if (langCode) {
          const langInfo = LANGUAGES.find(l => l.code === langCode);
          if (langInfo) {
            setDetectedLanguage(langInfo);
          } else {
            // Fallback for languages not in our list
            setDetectedLanguage({ code: langCode, name: langCode.toUpperCase(), flag: '🌐' });
          }
        } else {
          // Unknown language code
          setDetectedLanguage(null);
        }
      } else {
        setDetectedLanguage(null);
      }
    } catch (error) {
      console.error('Language detection error:', error);
      setDetectedLanguage(null);
    }
  }, []);

  // Debounce language detection
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (sourceLanguage === 'auto') {
        detectLanguage(inputText);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputText, sourceLanguage, detectLanguage]);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to translate');
      return;
    }

    if (targetLanguage === sourceLanguage && sourceLanguage !== 'auto') {
      toast.error('Source and target languages cannot be the same');
      return;
    }

    setLoading(true);
    try {
      const effectiveSourceLang = sourceLanguage === 'auto' 
        ? (detectedLanguage?.code || 'auto')
        : sourceLanguage;

      const result = await voicesApi.translateText(
        inputText.trim(),
        targetLanguage,
        effectiveSourceLang
      );

      if (result.translated_text) {
        setTranslatedText(result.translated_text);
        toast.success('Translation complete!');
      }

      if (result.error) {
        toast.error(`Translation warning: ${result.error}`);
      }
    } catch (error) {
      console.error('Translation error:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') {
      // Use detected language for swap
      if (detectedLanguage) {
        setSourceLanguage(targetLanguage);
        setTargetLanguage(detectedLanguage.code);
        const tempText = inputText;
        setInputText(translatedText);
        setTranslatedText(tempText);
        setDetectedLanguage(null);
      } else {
        toast.error('Cannot swap when source language is not detected');
      }
      return;
    }
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    const tempText = inputText;
    setInputText(translatedText);
    setTranslatedText(tempText);
  };

  const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setDetectedLanguage(null);
  };

  const getSourceDisplayText = () => {
    if (sourceLanguage !== 'auto') {
      const lang = LANGUAGES.find(l => l.code === sourceLanguage);
      return lang ? `${lang.flag} ${lang.name}` : sourceLanguage;
    }
    if (detectedLanguage) {
      return `🔍 Detected: ${detectedLanguage.flag} ${detectedLanguage.name}`;
    }
    return '🔍 Auto-detect';
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
              <Languages className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Text Translation</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Translate your text between {LANGUAGES.length} languages instantly with AI-powered translation
          </p>
        </div>

        {/* Translation Card */}
        <Card className="glass border-white/10">
          <CardContent className="p-6">
            {/* Language Selectors */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
              {/* Source Language */}
              <div className="flex-1 w-full">
                <Label className="mb-2 block">From</Label>
                <Select value={sourceLanguage} onValueChange={(val) => {
                  setSourceLanguage(val);
                  if (val !== 'auto') {
                    setDetectedLanguage(null);
                  }
                }}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue>
                      {getSourceDisplayText()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    <SelectItem value="auto">🔍 Auto-detect</SelectItem>
                    {Object.entries(getLanguagesByRegion()).map(([region, langs]) => (
                      <SelectGroup key={region}>
                        <SelectLabel className="text-xs text-muted-foreground font-semibold">{region}</SelectLabel>
                        {langs.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Swap Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapLanguages}
                className="mt-6 md:mt-0 shrink-0"
                disabled={sourceLanguage === 'auto' && !detectedLanguage}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>

              {/* Target Language */}
              <div className="flex-1 w-full">
                <Label className="mb-2 block">To</Label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    {Object.entries(getLanguagesByRegion()).map(([region, langs]) => (
                      <SelectGroup key={region}>
                        <SelectLabel className="text-xs text-muted-foreground font-semibold">{region}</SelectLabel>
                        {langs.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Text Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Enter text</Label>
                  <span className="text-xs text-muted-foreground">{inputText.length}/5000</span>
                </div>
                <Textarea
                  placeholder="Type or paste your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[200px] bg-background/50 resize-none"
                  maxLength={5000}
                />
              </div>

              {/* Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Translation</Label>
                  {translatedText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-6 px-2 text-xs"
                    >
                      {copied ? (
                        <><Check className="w-3 h-3 mr-1" /> Copied</>
                      ) : (
                        <><Copy className="w-3 h-3 mr-1" /> Copy</>
                      )}
                    </Button>
                  )}
                </div>
                <div className="min-h-[200px] bg-background/50 rounded-md border border-input p-3 relative">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : translatedText ? (
                    <p className="text-sm whitespace-pre-wrap">{translatedText}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Translation will appear here...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                size="lg"
                variant="gradient"
                onClick={handleTranslate}
                disabled={loading || !inputText.trim()}
                className="flex-1 h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Translate
                  </>
                )}
              </Button>
              {(inputText || translatedText) && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleClear}
                  className="h-12"
                >
                  Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
            { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
            { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
            { code: 'en', name: 'English', flag: '🇺🇸' },
          ].map((lang) => (
            <Button
              key={lang.code}
              variant="outline"
              className="glass border-white/10 h-auto py-3"
              onClick={() => {
                setTargetLanguage(lang.code);
                toast.success(`Target language set to ${lang.name}`);
              }}
            >
              <span className="text-lg mr-2">{lang.flag}</span>
              <span className="text-sm">Translate to {lang.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TextTranslate;
