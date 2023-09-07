from django.urls import path
from meethour.core import views

urlpatterns = [
    path('', views.index, name='index'),  # Use the appropriate view function names here
    path('schedulemeeting/', views.schedulemeeting, name='schedulemeeting'),
    path('schedulemeeting', views.schedulemeeting, name='schedulemeeting'),
    path('joinmeeting/', views.joinmeeting, name='joinmeeting'), #url path for joinmeeting through schedule or instant meeting
    path('joinmeeting', views.joinmeeting, name='joinmeeting'), #url path for joimeeting through joinmeeting from header menu
    # Define other URLs as needed
]
