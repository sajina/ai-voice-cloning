"""
URL configuration for AI Voice Cloning application.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def health_check(request):
    """Health check endpoint for Railway deployment."""
    return JsonResponse({'status': 'healthy'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/voices/', include('apps.voices.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/health/', health_check, name='health_check'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
