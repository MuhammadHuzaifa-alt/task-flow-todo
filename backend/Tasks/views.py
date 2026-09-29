from django.db.models import Q

from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(
    viewsets.ModelViewSet
):

    serializer_class = TaskSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        queryset = Task.objects.filter(
            user=self.request.user
        )

        search = self.request.query_params.get(
            "search"
        )

        task_status = self.request.query_params.get(
            "status"
        )

        priority = self.request.query_params.get(
            "priority"
        )

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                |
                Q(description__icontains=search)
            )

        if task_status:
            queryset = queryset.filter(
                status=task_status
            )

        if priority:
            queryset = queryset.filter(
                priority=priority
            )

        return queryset

    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )

    def destroy(self, request, *args, **kwargs):

        task = self.get_object()

        task.delete()

        return Response(
            {
                "detail":
                "Task deleted successfully."
            },
            status=status.HTTP_200_OK,
        )