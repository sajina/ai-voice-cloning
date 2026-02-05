from django.contrib import admin
from .models import Transaction, PaymentSettings

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'credits', 'transaction_id', 'screenshot', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'transaction_id')
    readonly_fields = ('created_at', 'updated_at')
    
    actions = ['approve_transactions', 'reject_transactions']

    @admin.action(description='Approve selected transactions')
    def approve_transactions(self, request, queryset):
        for tx in queryset:
            if tx.status == 'pending':
                tx.status = 'approved'
                tx.user.credits += tx.credits
                tx.user.save()
                tx.save()

    @admin.action(description='Reject selected transactions')
    def reject_transactions(self, request, queryset):
        queryset.update(status='rejected')

@admin.register(PaymentSettings)
class PaymentSettingsAdmin(admin.ModelAdmin):
    list_display = ('upi_id', 'is_active', 'updated_at')
