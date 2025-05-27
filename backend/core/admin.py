from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from .models import Room, Tenant, Payment, Complaint

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'phone')}),
    )
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role',)

admin.site.register(Room)
admin.site.register(Tenant)
admin.site.register(Payment)
admin.site.register(Complaint)