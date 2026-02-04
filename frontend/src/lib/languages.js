// All supported languages with flags and display names
export const LANGUAGES = [
  // Major Languages
  { code: 'en', name: 'English', flag: '🇺🇸', region: 'Major' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', region: 'Major' },
  { code: 'fr', name: 'French', flag: '🇫🇷', region: 'Major' },
  { code: 'de', name: 'German', flag: '🇩🇪', region: 'Major' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', region: 'Major' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', region: 'Major' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', region: 'Major' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', region: 'Major' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', region: 'Major' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', region: 'Major' },
  
  // South Asian
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', region: 'South Asian' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', region: 'South Asian' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', region: 'South Asian' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', region: 'South Asian' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', region: 'South Asian' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', region: 'South Asian' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', region: 'South Asian' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', region: 'South Asian' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', region: 'South Asian' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', region: 'South Asian' },
  
  // Southeast Asian
  { code: 'th', name: 'Thai', flag: '🇹🇭', region: 'Southeast Asian' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', region: 'Southeast Asian' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', region: 'Southeast Asian' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', region: 'Southeast Asian' },
  { code: 'fil', name: 'Filipino', flag: '🇵🇭', region: 'Southeast Asian' },
  { code: 'my', name: 'Burmese', flag: '🇲🇲', region: 'Southeast Asian' },
  
  // Middle Eastern
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', region: 'Middle Eastern' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', region: 'Middle Eastern' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷', region: 'Middle Eastern' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', region: 'Middle Eastern' },
  
  // European
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', region: 'European' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', region: 'European' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', region: 'European' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', region: 'European' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', region: 'European' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', region: 'European' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', region: 'European' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', region: 'European' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', region: 'European' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', region: 'European' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', region: 'European' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', region: 'European' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', region: 'European' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', region: 'European' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', region: 'European' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', region: 'European' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', region: 'European' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', region: 'European' },
  { code: 'ca', name: 'Catalan', flag: '🇪🇸', region: 'European' },
  { code: 'ga', name: 'Irish', flag: '🇮🇪', region: 'European' },
  { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', region: 'European' },
  
  // African
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', region: 'African' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', region: 'African' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹', region: 'African' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦', region: 'African' },
];

// Get language by code
export const getLanguage = (code) => LANGUAGES.find(l => l.code === code);

// Get languages grouped by region
export const getLanguagesByRegion = () => {
  const regions = {};
  LANGUAGES.forEach(lang => {
    if (!regions[lang.region]) regions[lang.region] = [];
    regions[lang.region].push(lang);
  });
  return regions;
};

export default LANGUAGES;
