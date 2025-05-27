from django.shortcuts import render

from rest_framework import generics, permissions
from .models import Room, Tenant, Payment, Complaint
from .serializers import RoomSerializer, TenantSerializer, PaymentSerializer, ComplaintSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import pytesseract
from PIL import Image
import io
import re


# Room APIs
class RoomListCreateView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]


# Tenant APIs
class TenantListCreateView(generics.ListCreateAPIView):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]

class TenantDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]


# Payment APIs
class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

class PaymentDetailView(generics.RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]


# Complaint APIs
class ComplaintListCreateView(generics.ListCreateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

class ComplaintDetailView(generics.RetrieveUpdateAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]


class OCRParseIDView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            image = Image.open(file_obj)
            extracted_text = pytesseract.image_to_string(image)

            # Try regex first
            name_match = re.search(r'Name[:\-]?\s*([A-Z][a-zA-Z ]+)', extracted_text)
            dob_match = re.search(r'DOB[:\-]?\s*(\d{2}[\/\-]\d{2}[\/\-]\d{4})', extracted_text)
            id_match = re.search(r'\b\d{4}\s\d{4}\s\d{4}\b', extracted_text)  # Aadhaar-style

            # If regex fails, try line-based fallback for name
            name_guess = None
            lines = extracted_text.splitlines()
            for i, line in enumerate(lines):
                if "DOB" in line.upper() and i > 0:
                    name_guess = lines[i - 1].strip()
                    break

            data = {
                "raw_text": extracted_text,
                "name": name_match.group(1) if name_match else name_guess,
                "dob": dob_match.group(1) if dob_match else None,
                "id_number": id_match.group(0) if id_match else None
            }

            return Response(data)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
