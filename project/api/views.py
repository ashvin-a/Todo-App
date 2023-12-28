from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializer import TaskSerializer
from .models import Task

# Create your views here.
@api_view(["GET"])
def api_overview(request):
    api_urls = {
        "List": "/task-list/",
        "Detail-view": "/task-detail/<str:pk>",
        "Create": "/task-create/",
        "Update": "/task-update/<str:pk>",
        "Delete": "/task-delete/<str:pk>",
    }

    return Response(api_urls)

def tasklist(request):
    all_task = Task.objects.all()
    serializer = TaskSerializer()
