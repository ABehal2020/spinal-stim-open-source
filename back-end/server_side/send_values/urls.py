from .api.send_values_api import SpinalStimDataViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'stim', SpinalStimDataViewSet)
urlpatterns = router.urls