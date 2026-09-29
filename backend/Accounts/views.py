from django.contrib.auth import get_user_model

from rest_framework import generics, status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    UpdateProfileSerializer,
)


User = get_user_model()


class RegisterView(
    generics.CreateAPIView
):

    serializer_class = RegisterSerializer

    permission_classes = [
        AllowAny
    ]


class MeView(
    generics.RetrieveUpdateAPIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get_serializer_class(self):
        if self.request.method == "PATCH":
            return UpdateProfileSerializer

        return UserSerializer

    def get_object(self):
        return self.request.user


class LogoutView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        refresh_token = request.data.get(
            "refresh"
        )

        if not refresh_token:
            return Response(
                {
                    "detail":
                    "Refresh token is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:

            token = RefreshToken(
                refresh_token
            )

            token.blacklist()

            return Response(
                {
                    "detail":
                    "Successfully logged out."
                },
                status=status.HTTP_200_OK,
            )

        except Exception:

            return Response(
                {
                    "detail":
                    "Invalid refresh token."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )