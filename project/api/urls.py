from django.urls import path
from . import views

urlpatterns = [
    path("", views.api_overview, name="base"),
    path("task-list/", views.tasklist, name="task-list"),
    path("task-create/", views.postView, name="post-task"),
    path("task-list/<int:pk>", views.detailView, name="detail-view"),
    path("task-update/<int:pk>", views.updateView, name="update-detail"),
    path("task-delete/<int:pk>", views.deleteTask, name="delete-task"),
]
