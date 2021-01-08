from django.conf.urls import url

from .views import (postData, postImage)

urlpatterns = [
    url(r'^postdata', postData),
    url(r'^postimage', postImage)
]