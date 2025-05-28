from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .auth_views import RegisterView, UserView
from .views import (
    RoomListCreateView, RoomDetailView,
    TenantListCreateView, TenantDetailView,
    PaymentListCreateView, PaymentDetailView,
    ComplaintListCreateView, ComplaintDetailView
)
from .views import OCRParseIDView
from .auth_views import CustomLoginView
from .views import DashboardSummaryView
from .views import TenantDashboardView

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomLoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', UserView.as_view(), name='user_profile'),

    # Room
    path('rooms/', RoomListCreateView.as_view(), name='room-list-create'),
    path('rooms/<int:pk>/', RoomDetailView.as_view(), name='room-detail'),

    # Tenant
    path('tenants/', TenantListCreateView.as_view(), name='tenant-list-create'),
    path('tenants/<int:pk>/', TenantDetailView.as_view(), name='tenant-detail'),

    # Payment
    path('payments/', PaymentListCreateView.as_view(), name='payment-list-create'),
    path('payments/<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),

    # Complaint
    path('complaints/', ComplaintListCreateView.as_view(), name='complaint-list-create'),
    path('complaints/<int:pk>/', ComplaintDetailView.as_view(), name='complaint-detail'),

    path('ocr/parse-id/', OCRParseIDView.as_view(), name='ocr-parse-id'),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('tenant/dashboard/', TenantDashboardView.as_view(), name='tenant-dashboard'),
]
