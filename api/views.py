from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import TaskSerializer

from .models import Task

from rest_framework import permissions

from rest_framework.generics import (
    ListCreateAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView
)

class TaskListView(ListCreateAPIView):
    """ 
    Read-write endpoints use this view to show a list of model objects.
    Can create a new object in this view too.
    """
    queryset = Task.objects.all().order_by('-id')
    serializer_class = TaskSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class TaskDetailView(RetrieveUpdateDestroyAPIView):
    """ 
    Through the API, can see detail, update and/or delete object.
    The slug uses pk.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List': '/task-list/',
        'Detail/Create/Update/Delete View': '/task-detail/<str:pk>/',
    }

    return Response(api_urls)

""" @api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List': '/task-list/',
        'Detail View': '/task-detail/<str:pk>/',
        'Create': '/task-create/',
        'Update': '/task-update/<str:pk/',
        'Delete': '/task-delete/<str:pk>/'
    }

    return Response(api_urls)

@api_view(['GET'])
def taskList(request):
    tasks = Task.objects.all().order_by('-id')                      # Query objects
    serializer = TaskSerializer(tasks, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def taskDetail(request, pk):
    tasks = Task.objects.get(id=pk)                    # Query objects
    serializer = TaskSerializer(tasks, many=False)     # many=False returns 1 object based on query
    
    return Response(serializer.data)

@api_view(['POST'])
def taskCreate(request):
    serializer = TaskSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['POST'])
def taskUpdate(request, pk):
    tasks = Task.objects.get(id=pk)
    serializer = TaskSerializer(instance=tasks, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)

@api_view(['DELETE'])
def taskDelete(request, pk):
    tasks = Task.objects.get(id=pk)
    tasks.delete()

    return Response('Item successfully deleted!') """