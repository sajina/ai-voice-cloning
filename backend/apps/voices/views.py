from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta

from apps.users.views import IsAdminPermission
from .models import VoiceProfile, VoiceClone, GeneratedSpeech
from .serializers import (
    VoiceProfileSerializer,
    VoiceCloneSerializer,
    VoiceCloneCreateSerializer,
    GeneratedSpeechSerializer,
    GenerateSpeechSerializer,
    TranslateTextSerializer,
    AdminVoiceProfileSerializer,
    AdminVoiceCloneSerializer,
    AdminGeneratedSpeechSerializer,
)
from .services import voice_service
from .translation import translation_service


class VoiceProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """List and retrieve voice profiles (read-only for users)."""
    
    queryset = VoiceProfile.objects.filter(is_active=True)
    serializer_class = VoiceProfileSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # Return all profiles without pagination
    filterset_fields = ['gender', 'emotion', 'language', 'is_premium']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class VoiceCloneViewSet(viewsets.ModelViewSet):
    """CRUD operations for user's voice clones."""
    
    serializer_class = VoiceCloneSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return VoiceClone.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return VoiceCloneCreateSerializer
        return VoiceCloneSerializer
    
    def perform_create(self, serializer):
        print(f"DEBUG: Validated Data: {serializer.validated_data}")
        voice_clone = serializer.save()
        # Process the voice clone (in background in production)
        voice_service.process_voice_clone(voice_clone)


class GenerateSpeechView(generics.CreateAPIView):
    """Generate speech from text."""
    
    serializer_class = GenerateSpeechSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        from django.db.models import F
        from apps.users.models import User # Ensure User is imported
        import traceback

        print(f"DEBUG: Generate request for user {request.user.email}")

        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            is_preview = serializer.validated_data.get('is_preview', False)
            
            if is_preview:
                if len(serializer.validated_data['text']) > 200:
                    return Response(
                        {'error': 'Preview text must be 200 characters or less.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                CREDIT_COST = 0
            else:
                CREDIT_COST = 5
            
            print(f"DEBUG: Attempting to deduct credits (Cost: {CREDIT_COST})...")
            
            if CREDIT_COST > 0:
                updated = User.objects.filter(
                    id=request.user.id, 
                    credits__gte=CREDIT_COST
                ).update(credits=F('credits') - CREDIT_COST)

                if updated == 0:
                    print("DEBUG: Insufficient credits")
                    return Response(
                        {'error': 'Insufficient credits. Please recharge.'},
                        status=status.HTTP_402_PAYMENT_REQUIRED
                    )
                print("DEBUG: Credits deducted.")
            
            request.user.refresh_from_db()
            balance_after = request.user.credits
            print(f"DEBUG: New Balance: {balance_after}")

            voice_profile = None
            voice_clone = None
            
            if serializer.validated_data.get('voice_profile_id'):
                try:
                    voice_profile = VoiceProfile.objects.get(
                        id=serializer.validated_data['voice_profile_id'],
                        is_active=True
                    )
                except VoiceProfile.DoesNotExist:
                    print("DEBUG: Voice Profile not found")
                    User.objects.filter(id=request.user.id).update(credits=F('credits') + CREDIT_COST)
                    return Response(
                        {'error': 'Voice profile not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            
            if serializer.validated_data.get('voice_clone_id'):
                try:
                    voice_clone = VoiceClone.objects.get(
                        id=serializer.validated_data['voice_clone_id'],
                        user=request.user,
                        is_active=True,
                        status='ready'
                    )
                except VoiceClone.DoesNotExist:
                    print("DEBUG: Voice Clone not found")
                    User.objects.filter(id=request.user.id).update(credits=F('credits') + CREDIT_COST)
                    return Response(
                        {'error': 'Voice clone not found or not ready'},
                        status=status.HTTP_404_NOT_FOUND
                    )
            
            print(f"DEBUG: Generating speech for text: {serializer.validated_data['text'][:20]}...")
            # Generate speech
            result = voice_service.generate_speech(
                text=serializer.validated_data['text'],
                voice_profile=voice_profile,
                voice_clone=voice_clone
            )
            print(f"DEBUG: Generation result: {result}")
            
            # Save generated speech record
            generated = GeneratedSpeech.objects.create(
                user=request.user,
                voice_profile=voice_profile,
                voice_clone=voice_clone,
                input_text=serializer.validated_data['text'],
                audio_file=result['audio_path'],
                duration_seconds=result['duration'],
                credits_used=CREDIT_COST,
                balance_after=balance_after
            )
            print("DEBUG: Record saved successfully")
            
            return Response(
                GeneratedSpeechSerializer(generated).data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            print(f"CRITICAL ERROR in GenerateSpeechView: {e}")
            traceback.print_exc()
            # Atomic Refund if generation fails
            User.objects.filter(id=request.user.id).update(credits=F('credits') + CREDIT_COST)
            return Response(
                {'error': f'Generation failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TranslateTextView(generics.CreateAPIView):
    """Translate text to target language."""
    
    serializer_class = TranslateTextSerializer
    permission_classes = [IsAuthenticated]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        text = serializer.validated_data['text']
        target_language = serializer.validated_data['target_language']
        source_language = serializer.validated_data.get('source_language', 'auto')
        
        # Perform translation
        result = translation_service.translate(text, target_language, source_language)
        
        if result['success']:
            return Response({
                'original_text': text,
                'translated_text': result['translated_text'],
                'source_language': result['source_language'],
                'target_language': result['target_language'],
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'original_text': text,
                'translated_text': result['translated_text'],
                'source_language': result['source_language'],
                'target_language': result['target_language'],
                'error': result['error'],
            }, status=status.HTTP_200_OK)  # Still return 200 with partial data


class SpeechHistoryViewSet(viewsets.ModelViewSet):
    """User's generated speech history."""
    
    serializer_class = GeneratedSpeechSerializer
    permission_classes = [IsAuthenticated]
    ordering_fields = ['created_at']
    http_method_names = ['get', 'delete', 'head', 'options']
    
    def get_queryset(self):
        return GeneratedSpeech.objects.filter(user=self.request.user)


# Admin ViewSets

class AdminVoiceProfileViewSet(viewsets.ModelViewSet):
    """Admin CRUD for voice profiles."""
    
    queryset = VoiceProfile.objects.all()
    serializer_class = AdminVoiceProfileSerializer
    permission_classes = [IsAdminPermission]
    filterset_fields = ['gender', 'emotion', 'language', 'is_active', 'is_premium']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class AdminVoiceCloneViewSet(viewsets.ModelViewSet):
    """Admin CRUD for voice clones."""
    
    queryset = VoiceClone.objects.all()
    serializer_class = AdminVoiceCloneSerializer
    permission_classes = [IsAdminPermission]
    filterset_fields = ['status', 'is_active']
    search_fields = ['name', 'user__email']
    ordering_fields = ['created_at']
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve and activate a voice clone."""
        clone = self.get_object()
        clone.status = 'ready'
        clone.is_active = True
        clone.save()
        return Response({'message': 'Voice clone approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a voice clone."""
        clone = self.get_object()
        clone.status = 'failed'
        clone.is_active = False
        clone.save()
        return Response({'message': 'Voice clone rejected'})


class AdminGeneratedSpeechViewSet(viewsets.ReadOnlyModelViewSet):
    """Admin view for generated speeches."""
    
    queryset = GeneratedSpeech.objects.all()
    serializer_class = AdminGeneratedSpeechSerializer
    permission_classes = [IsAdminPermission]
    filterset_fields = ['voice_profile', 'voice_clone']
    search_fields = ['input_text', 'user__email']
    ordering_fields = ['created_at']


class AdminDashboardView(generics.GenericAPIView):
    """Admin dashboard statistics."""
    
    permission_classes = [IsAdminPermission]
    
    def get(self, request):
        today = timezone.now()
        last_30_days = today - timedelta(days=30)
        last_7_days = today - timedelta(days=7)
        
        # Voice profiles stats
        total_profiles = VoiceProfile.objects.count()
        active_profiles = VoiceProfile.objects.filter(is_active=True).count()
        
        # Voice clones stats
        total_clones = VoiceClone.objects.count()
        pending_clones = VoiceClone.objects.filter(status='pending').count()
        ready_clones = VoiceClone.objects.filter(status='ready').count()
        
        # Generated speeches stats
        total_generations = GeneratedSpeech.objects.count()
        monthly_generations = GeneratedSpeech.objects.filter(
            created_at__gte=last_30_days
        ).count()
        weekly_generations = GeneratedSpeech.objects.filter(
            created_at__gte=last_7_days
        ).count()
        
        # Most used voices
        top_voices = VoiceProfile.objects.annotate(
            usage_count=Count('generated_speeches')
        ).order_by('-usage_count')[:5]
        
        return Response({
            'voice_profiles': {
                'total': total_profiles,
                'active': active_profiles,
            },
            'voice_clones': {
                'total': total_clones,
                'pending': pending_clones,
                'ready': ready_clones,
            },
            'generated_speeches': {
                'total': total_generations,
                'this_month': monthly_generations,
                'this_week': weekly_generations,
            },
            'top_voices': VoiceProfileSerializer(top_voices, many=True).data,
        })
