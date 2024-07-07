from rest_framework import serializers
from .models import Task

"""
Class for serializer
"""
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
