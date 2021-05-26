from django.urls import path
from . import views

from .views import (
    TaskListView,
    TaskDetailView
)


urlpatterns = [
    path('', views.apiOverview, name='api-overview'),

    path('task-list/', TaskListView.as_view(), name='task-list'),
    path('task-detail/<str:pk>/', TaskDetailView.as_view(), name='task-detail'),

    #path('task-list/', views.taskList, name='task-list'),
    #path('task-detail/<str:pk>/', views.taskDetail, name='task-detail'),
    #path('task-create/', views.taskCreate, name='task-create'),
    #path('task-update/<str:pk>/', views.taskUpdate, name='task-update'),
    #path('task-delete/<str:pk>/', views.taskDelete, name='task-delete'),
]