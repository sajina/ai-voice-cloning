from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model

from .serializers import (
    UserSerializer,
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    AdminUserSerializer,
    SendOTPSerializer,
    VerifyOTPSerializer,
)
from .models import EmailOTP

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """JWT login endpoint with custom token."""
    
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile."""
    
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    """Change user password."""
    
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.request.user.set_password(serializer.validated_data['new_password'])
        self.request.user.save()
        return Response({'message': 'Password updated successfully'})


class SendOTPView(generics.CreateAPIView):
    """Send OTP to email for registration."""
    
    serializer_class = SendOTPSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # Bypass default auth (and thus CSRF if SessionAuth is default)
    
    def create(self, request, *args, **kwargs):
        import random
        from django.utils import timezone
        from datetime import timedelta
        from django.core.mail import send_mail
        from django.conf import settings
        from django.contrib.auth.hashers import make_password
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        name = serializer.validated_data['name']
        password = serializer.validated_data['password']
        
        # Generate 6-digit OTP
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        # Delete any existing OTPs for this email
        EmailOTP.objects.filter(email=email).delete()
        
        # Create new OTP record (store hashed password)
        EmailOTP.objects.create(
            email=email,
            otp=otp,
            name=name,
            password=make_password(password),
            expires_at=timezone.now() + timedelta(minutes=10)
        )
        
        # Send email
        try:
            send_mail(
                subject='VoiceAI - Email Verification OTP',
                message=f'Your OTP for VoiceAI registration is: {otp}\n\nThis code expires in 10 minutes.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,  # We catch exceptions below to prevent crash
            )
        except Exception as e:
            print("EMAIL ERROR:", e)
            # We do NOT raise here to avoid 500 error on client side if email fails
            # This mimics fail_silently=True but with logging
            # return Response({'error': 'Email failed'}, status=500) # Optional: return error
            # For now, we proceed as if sent, or strict:
            return Response({'error': 'Failed to send email. Check logs.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'message': 'OTP sent to your email'}, status=status.HTTP_200_OK)


class TextMailView(generics.CreateAPIView):
    """Send text email via API."""
    permission_classes = [AllowAny]
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        from django.core.mail import send_mail
        from django.conf import settings

        email = request.data.get('email')
        message = request.data.get('message')

        if not email or not message:
            return Response({'error': 'Email and message are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            send_mail(
                subject='VoiceAI - Text Mail Message',
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            print("TEXTMAIL ERROR:", e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'Mail sent successfully'}, status=status.HTTP_200_OK)

    def options(self, request, *args, **kwargs):
        """Handle preflight OPTIONS request explicitly."""
        response = Response(status=status.HTTP_200_OK)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response


class VerifyOTPView(generics.CreateAPIView):
    """Verify OTP and create user."""
    
    serializer_class = VerifyOTPSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # Bypass default auth
    
    def create(self, request, *args, **kwargs):
        from django.contrib.auth.hashers import check_password
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        
        # Find OTP record
        try:
            otp_record = EmailOTP.objects.get(email=email, is_used=False)
        except EmailOTP.DoesNotExist:
            return Response(
                {'error': 'No OTP found for this email. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if expired
        if otp_record.is_expired:
            otp_record.delete()
            return Response(
                {'error': 'OTP has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check OTP match
        if otp_record.otp != otp:
            return Response(
                {'error': 'Invalid OTP. Please try again.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create(
            email=otp_record.email,
            name=otp_record.name,
            password=otp_record.password,  # Already hashed
        )
        
        # Mark OTP as used
        otp_record.is_used = True
        otp_record.save()
        
        return Response({
            'message': 'Account created successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class IsAdminPermission(IsAdminUser):
    """Custom permission for admin users."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_administrator


class AdminUserViewSet(viewsets.ModelViewSet):
    """Admin CRUD operations for users."""
    
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminPermission]
    filterset_fields = ['is_active', 'is_admin']
    search_fields = ['email', 'name']
    ordering_fields = ['created_at', 'name']
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get user statistics for admin dashboard."""
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        admin_users = User.objects.filter(is_admin=True).count()
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'admin_users': admin_users,
        })


class DebugCORSView(generics.GenericAPIView):
    """
    Debug view to inspect CORS and CSRF settings in production.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        from django.conf import settings
        
        # Get raw headers
        headers = {k: v for k, v in request.META.items() if k.startswith('HTTP_')}
        
        return Response({
            'DEBUG': settings.DEBUG,
            'CORS_ALLOWED_ORIGINS': getattr(settings, 'CORS_ALLOWED_ORIGINS', 'Not Set'),
            'CSRF_TRUSTED_ORIGINS': getattr(settings, 'CSRF_TRUSTED_ORIGINS', 'Not Set'),
            'ALLOWED_HOSTS': settings.ALLOWED_HOSTS,
            'Request Origin': request.headers.get('Origin', 'No Origin Header'),
            'Request Host': request.get_host(),
            'Request Headers': headers,
        })
