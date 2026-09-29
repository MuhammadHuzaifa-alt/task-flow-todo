from django.contrib import admin
from django.urls import include, path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [

    # Django admin
    path(
        "admin/",
        admin.site.urls
    ),

    # Authentication
    path(
        "api/auth/",
        include(
            "Accounts.urls"
        )
    ),

    # JWT login
    path(
        "api/auth/login/",
        TokenObtainPairView.as_view(),
        name="token-login",
    ),

    # JWT refresh
    path(
        "api/auth/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),

    # Tasks
    path(
        "api/",
        include(
            "Tasks.urls"
        )
    ),

    # Dashboard
    path(
        "api/dashboard/",
        include(
            "Dashboard.urls"
        )
    ),
]