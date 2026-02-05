import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { voicesApi } from '@/api/voices';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Volume2, Loader2, Download, Play, Square, Sparkles, Trash2, Clock, Languages } from 'lucide-react';
import toast from 'react-hot-toast';
import { LANGUAGES, getLanguagesByRegion, SAMPLE_TEXTS } from '@/lib/languages';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function VoiceGenerate() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const [selectedVoiceIds, setSelectedVoiceIds] = useState(new Set());
  const [voiceType, setVoiceType] = useState('profile');
  const [profiles, setProfiles] = useState([]);
  const [clones, setClones] = useState([]);
  const [loading, setLoading] = useState(false);

  const [generatedHistory, setGeneratedHistory] = useState([]);
  const [playingId, setPlayingId] = useState(null);

  const audioInstance = useRef(null);

  // Preview State
  const [previewPlayingId, setPreviewPlayingId] = useState(null);
  const [previewLoadingId, setPreviewLoadingId] = useState(null);
  const previewAudioInstance = useRef(null);

  // Filters
  const [gender, setGender] = useState('all');
  const [emotion, setEmotion] = useState('all');
  const [language, setLanguage] = useState('all');

  // Translation - always enabled, uses the language filter
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      const [profilesRes, clonesRes] = await Promise.all([
        voicesApi.getProfiles(),
        voicesApi.getClones(),
      ]);
      setProfiles(profilesRes.results || profilesRes || []);
      setClones(clonesRes.results || clonesRes || []);
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  const filteredProfiles = profiles.filter((p) => {
    if (gender !== 'all' && p.gender !== gender) return false;
    if (emotion !== 'all' && p.emotion !== emotion) return false;
    if (language !== 'all' && p.language !== language) return false;
    return true;
  });

  // Ref to prevent double execution
  const isGenerating = useRef(false);

  const handleGenerate = async () => {
    // Prevent double execution
    if (isGenerating.current || loading || translating) {
      console.log('Already generating, skipping...');
      return;
    }

    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    const selectedIds = Array.from(selectedVoiceIds);
    if (selectedIds.length === 0) {
      toast.error('Please select at least one voice');
      return;
    }

    // Set guard
    isGenerating.current = true;
    setLoading(true);
    
    try {
      let finalText = text.trim();
      
      // If a specific language is selected, translate first
      if (language !== 'all') {
        setTranslating(true);
        try {
          const translationResult = await voicesApi.translateText(finalText, language);
          if (translationResult.translated_text) {
            finalText = translationResult.translated_text;
            setTranslatedText(finalText);
            toast.success(`Translated to ${LANGUAGES.find(l => l.code === language)?.name || language}`);
          }
          if (translationResult.error) {
            toast.error(`Translation warning: ${translationResult.error}`);
          }
        } catch (translateError) {
          console.error('Translation error:', translateError);
          toast.error('Translation failed, using original text');
        } finally {
          setTranslating(false);
        }
      } else {
        setTranslatedText(''); // Clear any previous translation
      }

      // Batch generate for all selected voices
      console.log('Generating for voices:', selectedIds);
      const promises = selectedIds.map(id => {
        const data = {
          text: finalText,
          ...(voiceType === 'profile'
            ? { voice_profile_id: parseInt(id) }
            : { voice_clone_id: parseInt(id) }),
        };
        return voicesApi.generateSpeech(data);
      });

      const results = await Promise.all(promises);
      
      // Add all new results to history
      setGeneratedHistory(prev => [...results, ...prev]);
      
      toast.success(`Generated ${results.length} speech files!`);
      // Update credits
      try {
        await checkAuth();
      } catch (e) {
        console.error("Failed to refresh credits", e);
      }
      // Clear selection after successful generation (optional, keeping it might be better for tweaks)
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate speech. Some requests may have failed.');
    } finally {
      setLoading(false);
      isGenerating.current = false;
    }
  };

  const getAudioUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  const handlePlayPause = (item) => {
    if (playingId === item.id) {
      // Pause
      if (audioInstance.current) {
        audioInstance.current.pause();
      }
      setPlayingId(null);
    } else {
      // Play new
      if (audioInstance.current) {
        audioInstance.current.pause();
      }

      const url = getAudioUrl(item.audio_file);
      if (!url) {
        toast.error('Audio not available');
        return;
      }

      audioInstance.current = new Audio(url);
      audioInstance.current.onended = () => setPlayingId(null);
      audioInstance.current.play().catch(() => {
        toast.error('Failed to play audio');
      });
      setPlayingId(item.id);
    }
  };

  const handleDownload = async (item) => {
    const audioUrl = getAudioUrl(item.audio_file);
    if (!audioUrl) {
      toast.error('No audio file available');
      return;
    }

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice_${item.id || 'audio'}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to download audio');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this generated audio?')) return;
    try {
      if (id) {
         // If it has an ID, delete from backend
         await voicesApi.deleteHistory(id);
      }
      setGeneratedHistory(prev => prev.filter(item => item.id !== id));
      toast.success('Deleted');
    } catch (error) {
      console.error('Delete failed', error);
      toast.error('Failed to delete');
    }

  };

  const handlePreview = async (e, profile) => {
    e.stopPropagation(); // Prevent card selection when clicking play

    // Stop if currently playing this voice
    if (previewPlayingId === profile.id) {
      if (previewAudioInstance.current) {
        previewAudioInstance.current.pause();
        previewAudioInstance.current.currentTime = 0;
      }
      setPreviewPlayingId(null);
      return;
    }

    // Stop any other preview
    if (previewAudioInstance.current) {
      previewAudioInstance.current.pause();
      previewAudioInstance.current = null;
    }
    setPreviewPlayingId(null);

    // Start loading
    setPreviewLoadingId(profile.id);

    try {
      let audioUrl = profile.sample_audio;

      // If no sample audio, generate one on the fly
      if (!audioUrl) {
        const langCode = profile.language;
        // Use localized text or fallback to English
        const template = SAMPLE_TEXTS[langCode] || SAMPLE_TEXTS['en'];
        const sampleText = template.replace('{name}', profile.name);
        
        const result = await voicesApi.generateSpeech({
          text: sampleText,
          voice_profile_id: profile.id
        });
        audioUrl = result.audio_file;
      }

      const url = getAudioUrl(audioUrl);
      if (!url) throw new Error('Failed to get audio URL');

      const audio = new Audio(url);
      previewAudioInstance.current = audio;

      audio.onended = () => {
        setPreviewPlayingId(null);
      };

      await audio.play();
      setPreviewPlayingId(profile.id);

    } catch (error) {
      console.error('Preview failed:', error);
      toast.error('Failed to play preview');
    } finally {
      setPreviewLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">Voice Generation</span>
          </h1>
          <p className="text-muted-foreground">
            Transform your text into natural sounding speech
          </p>
        </div>

        <div className="grid gap-6">
          {/* Text Input */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Enter Your Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type or paste your text here... (up to 5000 characters)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[150px] bg-background/50"
                maxLength={5000}
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {text.length}/5000 characters
              </p>
            </CardContent>
          </Card>


            {/* Voice Selection */}
          <Card className="glass border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Select Voices ({selectedVoiceIds.size})
              </CardTitle>
              {selectedVoiceIds.size > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedVoiceIds(new Set())}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear Selection
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Tabs 
                value={voiceType} 
                onValueChange={(val) => {
                  setVoiceType(val);
                  setSelectedVoiceIds(new Set()); // Clear selection on tab change
                }}
              >
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="profile">
                    <Volume2 className="w-4 h-4 mr-2" />
                    Voice Profiles
                  </TabsTrigger>
                  <TabsTrigger value="clone">
                    <Sparkles className="w-4 h-4 mr-2" />
                    My Clones
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Emotion</Label>
                      <Select value={emotion} onValueChange={setEmotion}>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="happy">Happy</SelectItem>
                          <SelectItem value="sad">Sad</SelectItem>
                          <SelectItem value="angry">Angry</SelectItem>
                          <SelectItem value="excited">Excited</SelectItem>
                          <SelectItem value="calm">Calm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Target Language ({LANGUAGES.length})</Label>
                      <Select 
                        value={language} 
                        onValueChange={(val) => {
                          setLanguage(val);
                          setSelectedVoiceIds(new Set()); // Clear selection when language changes
                        }}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="All Languages" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[400px]">
                          <SelectItem value="all">🌍 All Languages</SelectItem>
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
                      {language !== 'all' && (
                        <p className="text-xs text-primary mt-1">
                          ✨ Text will be translated to {LANGUAGES.find(l => l.code === language)?.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Translation Preview */}
                  {translatedText && (
                    <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <p className="text-xs text-green-400 mb-2">Translated Text:</p>
                      <p className="text-sm">{translatedText}</p>
                    </div>
                  )}

                  {/* Voice Profiles Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {filteredProfiles.map((profile) => {
                      const isSelected = selectedVoiceIds.has(profile.id.toString());
                      return (
                        <div
                          key={profile.id}
                          onClick={() => {
                            const newSet = new Set(selectedVoiceIds);
                            const idStr = profile.id.toString();
                            if (newSet.has(idStr)) {
                              newSet.delete(idStr);
                            } else {
                              newSet.add(idStr);
                            }
                            setSelectedVoiceIds(newSet);
                          }}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/10 ring-1 ring-primary'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center mb-3">
                          <span className="text-lg">{LANGUAGES.find(l => l.code === profile.language)?.flag || '🌍'}</span>
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{profile.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {profile.gender} • {LANGUAGES.find(l => l.code === profile.language)?.name || profile.language}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 -mt-1 -mr-2 rounded-full hover:bg-white/10"
                            onClick={(e) => handlePreview(e, profile)}
                          >
                            {previewLoadingId === profile.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            ) : previewPlayingId === profile.id ? (
                              <Square className="w-4 h-4 text-primary fill-primary" />
                            ) : (
                              <Play className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                        );
                      })}
                  </div>
                </TabsContent>

                <TabsContent value="clone" className="py-12">
                  <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-white/10">
                      <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div className="max-w-md space-y-2">
                      <h3 className="text-xl font-semibold">Voice Cloning Coming Soon</h3>
                      <p className="text-muted-foreground">
                        We are working on integrating advanced AI for realistic voice cloning. 
                        Stay tuned for updates!
                      </p>
                    </div>
                    {/*
                    <Button variant="outline" disabled className="opacity-50">
                      <Clock className="w-4 h-4 mr-2" />
                      Available in v2.0
                    </Button>
                    */}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Cost Info */}
          {selectedVoiceIds.size > 0 && (
             <div className="flex justify-between items-center text-sm px-1">
                <span className="text-muted-foreground">
                    Selected: {selectedVoiceIds.size} voice{selectedVoiceIds.size > 1 ? 's' : ''}
                </span>
                <span className={user?.credits < (selectedVoiceIds.size * 5) ? "text-destructive font-bold" : "text-primary font-bold"}>
                    Total Cost: {selectedVoiceIds.size * 5} Credits
                </span>
             </div>
          )}

          {/* Generate Button */}
          <Button
            size="lg"
            variant={user?.credits < (selectedVoiceIds.size * 5) ? "destructive" : "gradient"}
            onClick={() => {
                if (user?.credits < (selectedVoiceIds.size * 5)) {
                    navigate('/pricing');
                } else {
                    handleGenerate();
                }
            }}
            disabled={loading || translating || selectedVoiceIds.size === 0}
            className="w-full h-14 text-lg"
          >
            {translating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Translating...
              </>
            ) : loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                {user?.credits < (selectedVoiceIds.size * 5) ? (
                    <>
                        <span className="mr-2">Insufficient Credits (Need {selectedVoiceIds.size * 5})</span>
                        <span className="underline">Recharge Now</span>
                    </>
                ) : (
                    <>
                        {language !== 'all' ? <Languages className="mr-2 h-5 w-5" /> : <Volume2 className="mr-2 h-5 w-5" />}
                        {language !== 'all' ? 'Translate & Generate Speech' : 'Generate Speech'}
                    </>
                )}
              </>
            )}
          </Button>

          {/* Generated Audio */}
          {/* Generated Audio List */}
          {generatedHistory.length > 0 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Session History
              </h2>
              {generatedHistory.map((item, index) => (
                <Card key={item.id || index} className="glass border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                        <Volume2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.input_text}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Duration: {item.duration_seconds?.toFixed(1)}s
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handlePlayPause(item)}
                        >
                          {playingId === item.id ? (
                            <Square className="w-4 h-4 text-primary" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDownload(item)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceGenerate;
