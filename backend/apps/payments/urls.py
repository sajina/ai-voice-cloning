from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, AdminTransactionViewSet, PaymentSettingsView

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'admin/transactions', AdminTransactionViewSet, basename='admin-transaction')

urlpatterns = [
    path('settings/', PaymentSettingsView.as_view(), name='payment-settings'),
    path('', include(router.urls)),
]
