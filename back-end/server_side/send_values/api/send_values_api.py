from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from ..models import SpinalStimData

class SpinalStimDataSerializer(ModelSerializer):
    class Meta:
        model = SpinalStimData
        fields = ['jobID', 'contactNum', 'currentVal', 'bodySide', 'contactSymmetry', 'signalingProcMethod', 'normalizationMethod', 'colormapOption', 'imageData', 'original', 'sourceJobID']

    def validate(self, user_data):
        if not (user_data['jobID'] or user_data['contactNum'] or user_data['currentVal'] or user_data['bodySide'] or user_data['contactSymmetry'] or user_data['signalingProcMethod'] or user_data['normalizationMethod'] or user_data['colormapOption'] or user_data['original'] or user_data['sourceJobID']):
            print('One or more of the fields is missing.')
            return ValidationError
        return user_data

    def create(self, user_data):
        new_input = SpinalStimData.objects.create(**user_data)
        new_input.save()
        return new_input

    def update(self, existing_input, user_data):
        fields = ['jobID', 'contactNum', 'currentVal', 'bodySide', 'contactSymmetry', 'signalingProcMethod', 'normalizationMethod', 'colormapOption', 'imageData', 'original', 'sourceJobID']
        for i in fields:
            field_value = user_data.get(i, getattr(existing_input, i))
            setattr(existing_input, i, field_value)
        existing_input.save()
        return existing_input

class SpinalStimDataViewSet(ModelViewSet):
    serializer_class = SpinalStimDataSerializer
    http_method_names = ['get', 'post', 'put', 'delete', 'options']
    queryset = SpinalStimData.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('jobID', 'contactNum', 'currentVal', 'bodySide', 'contactSymmetry', 'signalingProcMethod', 'normalizationMethod', 'colormapOption', 'original', 'sourceJobID')