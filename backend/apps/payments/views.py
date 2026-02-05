from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Transaction, PaymentSettings
from .serializers import TransactionSerializer, AdminTransactionSerializer, PaymentSettingsSerializer
from apps.users.views import IsAdminPermission

class TransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AdminTransactionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminPermission]
    serializer_class = AdminTransactionSerializer
    queryset = Transaction.objects.all().order_by('-created_at')
    filterset_fields = ['status', 'user__email']
    search_fields = ['transaction_id', 'user__email']

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        transaction = self.get_object()
        if transaction.status != 'pending':
            return Response({'error': 'Transaction already processed'}, status=status.HTTP_400_BAD_REQUEST)
        
        transaction.status = 'approved'
        transaction.save()
        
        # Add credits to user
        transaction.user.credits += transaction.credits
        transaction.user.save()
        
        return Response({'message': 'Transaction approved and credits added'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        transaction = self.get_object()
        if transaction.status != 'pending':
            return Response({'error': 'Transaction already processed'}, status=status.HTTP_400_BAD_REQUEST)
            
        transaction.status = 'rejected'
        transaction.save()
        return Response({'message': 'Transaction rejected'})

class PaymentSettingsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        settings = PaymentSettings.objects.filter(is_active=True).first()
        if not settings:
            return Response({'upi_id': 'sajin.602@oksbi', 'qr_code': None})
        serializer = PaymentSettingsSerializer(settings)
        return Response(serializer.data)
