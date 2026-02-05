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

export const SAMPLE_TEXTS = {
  // Major Languages
  en: "Hello, I am {name}. This is a sample of my voice.",
  es: "Hola, soy {name}. Esta es una muestra de mi voz.",
  fr: "Bonjour, je suis {name}. Ceci est un échantillon de ma voix.",
  de: "Hallo, ich bin {name}. Dies ist eine Hörprobe meiner Stimme.",
  pt: "Olá, eu sou {name}. Esta é uma amostra da minha voz.",
  it: "Ciao, sono {name}. Questo è un campione della mia voce.",
  ru: "Привет, я {name}. Это образец моего голоса.",
  ja: "こんにちは、{name}です。これは私の声のサンプルです。",
  ko: "안녕하세요, 저는 {name}입니다. 제 목소리 샘플입니다.",
  zh: "你好，我是{name}。这是我的声音样本。",
  
  // South Asian
  hi: "नमस्ते, मैं {name} हूँ। यह मेरी आवाज़ का नमूना है।",
  bn: "नमस्ते, मैं {name} हूँ। यह मेरी आवाज़ का एक नमूना है।", // Fallback to Hindi-like if translation unsure, or "নমস্কার, मैं {name}..."
  ta: "வணக்கம், நான் {name}. இது என் குரலின் மாதிரி.",
  te: "నమస్కారం, నేను {name}. ఇది నా గొంతు నమూనా.",
  mr: "नमस्कार, मी {name}. हा माझ्या आवाजाचा एक नमुना आहे.",
  gu: "નમસ્તે, હું {name} છું. આ મારા અવાજનો નમૂનો છે.",
  kn: "நமஸ்காரம், ನಾನು {name}. இது என்னுடைய குரல் மாதிரி.", // Verify translation
  ml: "നമസ്കാരം, ഞാൻ {name}. ഇതെന്റെ ശബ്ദത്തിന്റെ മാതൃകയാണ്.",
  pa: "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ, ਮੈਂ {name} ਹਾਂ। ਇਹ ਮੇਰੀ ਆਵਾਜ਼ ਦਾ ਨਮੂਨਾ ਹੈ।",
  ur: "ہیلو، میں {name} ہوں۔ یہ میری آواز کا نمونہ ہے۔",
  
  // Southeast Asian
  th: "สวัสดี ฉันชื่อ {name} นี่คือตัวอย่างเสียงของฉัน",
  vi: "Xin chào, tôi là {name}. Đây là mẫu giọng nói của tôi.",
  id: "Halo, saya {name}. Ini adalah contoh suara saya.",
  ms: "Halo, saya {name}. Ini adalah contoh suara saya.",
  fil: "Kamusta, ako si {name}. Ito ay isang halimbawa ng aking boses.",
  my: "မင်္ဂလာပါ، ကျွန်ုပ်အမည် {name} ပါ။ ဒါက ကျွန်ုပ်အသံနမူနာပါ။",
  
  // Middle Eastern
  ar: "مرحباً، أنا {name}. هذه عينة من صوتي.",
  he: "שלום, אני {name}. זו דוגמה של הקול שלי.",
  fa: "سلام، من {name} هستم. این نمونه‌ای از صدای من است.",
  tr: "Merhaba, ben {name}. Bu sesimin bir örneği.",
  
  // European
  nl: "Hallo, ik ben {name}. Dit is een voorbeeld van mijn stem.",
  pl: "Cześć, jestem {name}. To próbka mojego głosu.",
  sv: "Hej, jag heter {name}. Detta är ett prov på min röst.",
  da: "Hej, jeg hedder {name}. Dette er en prøve på min stemme.",
  no: "Hei, jeg heter {name}. Dette er en prøve på min stemme.",
  fi: "Hei, olen {name}. Tässä on näyte äänestäni.",
  el: "Γεια σας, είμαι ο/η {name}. Αυτό είναι ένα δείγμα της φωνής μου.",
  cs: "Ahoj, jsem {name}. Toto je ukázka mého hlasu.",
  hu: "Szia, {name} vagyok. Ez a hangom mintája.",
  ro: "Bună, sunt {name}. Acesta este un exemplu al vocii mele.",
  uk: "Привіт, я {name}. Це зразок мого голосу.",
  bg: "Здравейте, аз съм {name}. Това е проба от моя глас.",
  sk: "Ahoj, som {name}. Toto je ukážka môjho hlasu.",
  hr: "Bok, ja sam {name}. Ovo je uzorak mog glasa.",
  sl: "Živjo, jaz sem {name}. To je vzorec mojega glasu.",
  lt: "Labas, aš esu {name}. Tai mano balso pavyzdys.",
  lv: "Sveiki, es esmu {name}. Šis ir manas balss paraugs.",
  et: "Tere, olen {name}. See on minu hääle näidis.",
  ca: "Hola, soc {name}. Aquesta és una mostra de la meva veu.",
  ga: "Dia duit, is mise {name}. Seo sampla de mo ghuth.",
  cy: "Helo, {name} ydw i. Dyma sampl o fy llais.",
  
  // African
  sw: "Hujambo, mimi ni {name}. Hii ni sampuli ya sauti yangu.",
  af: "Hallo, ek is {name}. Hierdie is 'n voorbeeld van my stem.",
  am: "ሰላም፣ እኔ {name} ነኝ። ይህ የድምፄ ናሙና ነው።",
  zu: "Sawubona, ngingu-{name}. Lesi isibonelo sezwi lami.",
};

export default LANGUAGES;
