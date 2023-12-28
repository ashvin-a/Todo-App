from django.urls import path
from . import views

urlpatterns = [
    path("", views.api_overview, name="base"),
    path("task-list/", views.tasklist, name="task-list"),
    path("create-task/", views.postView, name="post-task"),
    path("task-list/<int:pk>", views.detailView, name="detail-view"),
    path("update-task/<int:pk>", views.updateView, name="update-detail"),
    path("delete-task/<int:pk>", views.deleteTask, name="delete-task"),
]
