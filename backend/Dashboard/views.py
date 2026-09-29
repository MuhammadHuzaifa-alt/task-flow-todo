from django.db.models import Count, Q

from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from Tasks.models import Task


class DashboardStatsView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        user_tasks = Task.objects.filter(
            user=request.user
        )

        stats = user_tasks.aggregate(
            total=Count("id"),

            completed=Count(
                "id",
                filter=Q(
                    status=Task.Status.COMPLETED
                )
            ),

            in_progress=Count(
                "id",
                filter=Q(
                    status=Task.Status.IN_PROGRESS
                )
            ),

            todo=Count(
                "id",
                filter=Q(
                    status=Task.Status.TODO
                )
            ),

            high_priority=Count(
                "id",
                filter=Q(
                    priority=Task.Priority.HIGH
                )
            ),
        )

        total = stats["total"]

        completed = stats["completed"]

        completion_percentage = (
            round(
                (completed / total) * 100,
                1
            )
            if total > 0
            else 0
        )

        return Response(
            {
                "total": total,
                "completed": completed,
                "in_progress":
                    stats["in_progress"],
                "todo": stats["todo"],
                "high_priority":
                    stats["high_priority"],
                "completion_percentage":
                    completion_percentage,
            }
        )