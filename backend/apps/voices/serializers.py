from rest_framework import serializers
from .models import VoiceProfile, VoiceClone, GeneratedSpeech


class VoiceProfileSerializer(serializers.ModelSerializer):
    """Serializer for voice profiles."""
    
    class Meta:
        model = VoiceProfile
        fields = [
            'id', 'name', 'description', 'gender', 'emotion', 'language',
            'sample_audio', 'preview_image', 'is_active', 'is_premium', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class VoiceCloneSerializer(serializers.ModelSerializer):
    """Serializer for voice clones."""
    
    class Meta:
        model = VoiceClone
        fields = [
            'id', 'name', 'description', 'audio_sample', 'status',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']


class VoiceCloneCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating voice clones."""
    
    class Meta:
        model = VoiceClone
        fields = ['name', 'description', 'audio_sample']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class GeneratedSpeechSerializer(serializers.ModelSerializer):
    """Serializer for generated speech."""
    
    voice_profile_name = serializers.CharField(source='voice_profile.name', read_only=True)
    voice_clone_name = serializers.CharField(source='voice_clone.name', read_only=True)
    
    class Meta:
        model = GeneratedSpeech
        fields = [
            'id', 'voice_profile', 'voice_profile_name', 'voice_clone',
            'voice_clone_name', 'input_text', 'audio_file',
            'duration_seconds', 'created_at'
        ]
        read_only_fields = ['id', 'audio_file', 'duration_seconds', 'created_at']


class GenerateSpeechSerializer(serializers.Serializer):
    """Serializer for speech generation request."""
    
    text = serializers.CharField(max_length=5000)
    voice_profile_id = serializers.IntegerField(required=False, allow_null=True)
    voice_clone_id = serializers.IntegerField(required=False, allow_null=True)
    
    def validate(self, attrs):
        if not attrs.get('voice_profile_id') and not attrs.get('voice_clone_id'):
            raise serializers.ValidationError('Either voice_profile_id or voice_clone_id is required')
        
        if attrs.get('voice_profile_id') and attrs.get('voice_clone_id'):
            raise serializers.ValidationError('Only one of voice_profile_id or voice_clone_id can be provided')
        
        return attrs


class TranslateTextSerializer(serializers.Serializer):
    """Serializer for text translation request."""
    
    text = serializers.CharField(max_length=5000)
    target_language = serializers.CharField(max_length=10)
    source_language = serializers.CharField(max_length=10, default='auto', required=False)


class AdminVoiceProfileSerializer(serializers.ModelSerializer):
    """Admin serializer for voice profiles (full CRUD)."""
    
    usage_count = serializers.SerializerMethodField()
    
    class Meta:
        model = VoiceProfile
        fields = '__all__'
    
    def get_usage_count(self, obj):
        return obj.generated_speeches.count()


class AdminVoiceCloneSerializer(serializers.ModelSerializer):
    """Admin serializer for voice clones."""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = VoiceClone
        fields = '__all__'


class AdminGeneratedSpeechSerializer(serializers.ModelSerializer):
    """Admin serializer for generated speeches."""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    voice_name = serializers.SerializerMethodField()
    
    class Meta:
        model = GeneratedSpeech
        fields = '__all__'
    
    def get_voice_name(self, obj):
        if obj.voice_profile:
            return obj.voice_profile.name
        elif obj.voice_clone:
            return f"{obj.voice_clone.name} (Clone)"
        return "Unknown"
