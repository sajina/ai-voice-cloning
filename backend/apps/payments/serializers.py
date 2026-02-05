from rest_framework import serializers
from .models import Transaction, PaymentSettings

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'credits', 'transaction_id', 'screenshot', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'credits', 'created_at']

    def create(self, validated_data):
        # Calculate credits based on amount (e.g. 1 INR = 1 Credit approx, or set packages)
        # For now, let's say user selects a package on frontend, and backend verifies specific amounts?
        # Or simpler: 1 INR = 1 Credit.
        # Let's assume frontend sends amount, and we give 1 Credit per Rupee (approx).
        
        amount = validated_data.get('amount')
        credits = int(amount) # 1:1 ratio for simplicity
        
        validated_data['credits'] = credits
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class AdminTransactionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'user_email', 'amount', 'credits', 'transaction_id', 'screenshot', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class PaymentSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentSettings
        fields = ['upi_id', 'qr_code', 'is_active']
