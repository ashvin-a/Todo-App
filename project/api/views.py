from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializer import TaskSerializer
from .models import Task
from django.shortcuts import redirect


# Create your views here.
@api_view(["GET"])
def api_overview(request):
    api_urls = {
        "List": "/task-list/",
        "Detail-view": "/task-detail/<int:pk>",
        "Create": "/task-create/",
        "Update": "/task-update/<int:pk>",
        "Delete": "/task-delete/<int:pk>",
    }

    return Response(api_urls)


@api_view(["GET", "DELETE"])
def tasklist(request):
    all_task = Task.objects.all().order_by('-id')
    serializer = TaskSerializer(all_task, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def detailView(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(task, many=False)
    return Response(serializer.data)


@api_view(["POST"])
def postView(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(["PATCH"])
def updateView(request, pk):
    task = Task.objects.get(id=pk)
    serializer = TaskSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


@api_view(["DELETE"])
def deleteTask(request, pk):
    task = Task.objects.get(id=pk)
    task.delete()
    return redirect("task-list")
