from django.db import models
from django.conf import settings

class Transaction(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    credits = models.IntegerField()
    transaction_id = models.CharField(max_length=100, unique=True, help_text="UPI Reference ID / UTR")
    screenshot = models.ImageField(upload_to='payment_screenshots/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, default='UPI')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.amount} - {self.status}"

class PaymentSettings(models.Model):
    upi_id = models.CharField(max_length=100, default='sajin.602@oksbi')
    qr_code = models.ImageField(upload_to='payment_settings/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Payment Settings'
        verbose_name_plural = 'Payment Settings'

    def __str__(self):
        return "Payment Configuration"

    def save(self, *args, **kwargs):
        # Singleton pattern logic to ensure only one active setting exists or just override?
        # For simplicity, we just save. Admin should manage.
        # Or checking existing count and preventing new?
        # Let's rely on retrieving `first()` in view.
        super().save(*args, **kwargs)
