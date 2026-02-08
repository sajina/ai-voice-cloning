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
                fail_silently=False,
            )
        except Exception as e:
            print("EMAIL ERROR:", e)
            raise
        
        return Response({'message': 'OTP sent to your email'}, status=status.HTTP_200_OK)


class VerifyOTPView(generics.CreateAPIView):
    """Verify OTP and create user."""
    
    serializer_class = VerifyOTPSerializer
    permission_classes = [AllowAny]
    
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
