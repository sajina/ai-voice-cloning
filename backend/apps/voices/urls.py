from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    VoiceProfileViewSet,
    VoiceCloneViewSet,
    GenerateSpeechView,
    TranslateTextView,
    SpeechHistoryViewSet,
    AdminVoiceProfileViewSet,
    AdminVoiceCloneViewSet,
    AdminGeneratedSpeechViewSet,
    AdminDashboardView,
)

router = DefaultRouter()
router.register(r'profiles', VoiceProfileViewSet, basename='voice-profiles')
router.register(r'clones', VoiceCloneViewSet, basename='voice-clones')
router.register(r'history', SpeechHistoryViewSet, basename='speech-history')

# Admin routes
router.register(r'admin/profiles', AdminVoiceProfileViewSet, basename='admin-voice-profiles')
router.register(r'admin/clones', AdminVoiceCloneViewSet, basename='admin-voice-clones')
router.register(r'admin/speeches', AdminGeneratedSpeechViewSet, basename='admin-speeches')

urlpatterns = [
    path('generate/', GenerateSpeechView.as_view(), name='generate-speech'),
    path('translate/', TranslateTextView.as_view(), name='translate-text'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('', include(router.urls)),
]
