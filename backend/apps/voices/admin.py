from django.contrib import admin
from .models import VoiceProfile, VoiceClone, GeneratedSpeech


@admin.register(VoiceProfile)
class VoiceProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'gender', 'emotion', 'language', 'is_active', 'is_premium', 'created_at']
    list_filter = ['gender', 'emotion', 'language', 'is_active', 'is_premium']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(VoiceClone)
class VoiceCloneAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'status', 'is_active', 'created_at']
    list_filter = ['status', 'is_active']
    search_fields = ['name', 'user__email']
    ordering = ['-created_at']
    raw_id_fields = ['user']


@admin.register(GeneratedSpeech)
class GeneratedSpeechAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'get_voice', 'duration_seconds', 'created_at']
    list_filter = ['created_at']
    search_fields = ['input_text', 'user__email']
    ordering = ['-created_at']
    raw_id_fields = ['user', 'voice_profile', 'voice_clone']
    
    def get_voice(self, obj):
        if obj.voice_profile:
            return obj.voice_profile.name
        elif obj.voice_clone:
            return f"{obj.voice_clone.name} (Clone)"
        return "Unknown"
    get_voice.short_description = 'Voice'
