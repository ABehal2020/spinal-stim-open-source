from django.db import models

# Create your models here.

class SpinalStimData(models.Model):
    jobID = models.CharField(max_length=100)
    caseNum = models.PositiveIntegerField(default=0)
    contactNum = models.PositiveIntegerField()
    currentVal = models.FloatField()
    bodySide = models.CharField(max_length=100)
    contactSymmetry = models.CharField(max_length=100)
    signalingProcMethod = models.CharField(max_length=1000)
    normalizationMethod = models.CharField(max_length=1000)
    colormapOption = models.CharField(max_length=100)
    imageData = models.BinaryField(null=True)
    original = models.BooleanField(null=True)
    sourceJobID = models.CharField(max_length=100)

    class Meta:
        ordering = ('jobID',)

    def __unicode__(self):
        if not (self.jobID or self.caseNum or self.contactNum or self.currentVal or self.bodySide or self.contactSymmetry or self.signalingProcMethod or self.normalizationMethod or self.colormapOption or self.original or self.sourceJobID):
            return u'One or more of the fields is missing'
        else:
            return u'Job Id: %s, Case Number: %d, Contact Number: %d, Current Value: %f, Body Side: %s, Contact Symetry: %s, Signal Processing Method: %s, Normalization Method: %s, Colormap Option: %s, Original: %r, Source: %s' \
                   % (self.jobID, self.caseNum, self.contactNum, self.currentVal, self.bodySide, self.contactSymmetry, self.signalingProcMethod, self.normalizationMethod, self.colormapOption, self.original, self.sourceJobID)