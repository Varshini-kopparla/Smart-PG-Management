from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('tenant', 'Tenant'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class Room(models.Model):
    ROOM_STATUS = (
        ('available', 'Available'),
        ('occupied', 'Occupied'),
    )
    number = models.CharField(max_length=10, unique=True)
    room_type = models.CharField(max_length=20)
    rent = models.DecimalField(max_digits=8, decimal_places=2)
    capacity = models.IntegerField()
    status = models.CharField(max_length=10, choices=ROOM_STATUS, default='available')

    def __str__(self):
        return f"Room {self.number} ({self.status})"


class Tenant(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    rent_amount = models.DecimalField(max_digits=8, decimal_places=2)
    join_date = models.DateField()
    id_proof = models.FileField(upload_to='id_proofs/')

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        if self.room:
            self.room.status = 'occupied'
            self.room.save()
        super().save(*args, **kwargs)
    
class Payment(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    month = models.CharField(max_length=20)
    year = models.IntegerField()
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=10, choices=[('paid', 'Paid'), ('unpaid', 'Unpaid')])
    date_paid = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.tenant.user.username} - {self.month} {self.year}"

class Complaint(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=20, default='Open')
    response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.tenant.user.username}"