from django.db import models
from django import forms
from django.contrib.auth.models import User
from PIL import Image
import hashlib


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    avatar = models.ImageField(default='default.jpg', upload_to='profile_images')
    bio = models.TextField()

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        super().save()

        img = Image.open(self.avatar.path)

        if img.height > 100 or img.width > 100:
            new_img = (100, 100)
            img.thumbnail(new_img)
            img.save(self.avatar.path)


class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    resume        = models.FileField('Upload Resumes', upload_to='resumes/')
    name          = models.CharField('Name', max_length=255, null=True, blank=True)
    email         = models.CharField('Email', max_length=255, null=True, blank=True)
    mobile_number = models.CharField('Mobile Number',  max_length=255, null=True, blank=True)
    education     = models.CharField('Education', max_length=255, null=True, blank=True)
    skills        = models.CharField('Skills', max_length=1000, null=True, blank=True)
    company_name  = models.CharField('Company Name', max_length=1000, null=True, blank=True)
    college_name  = models.CharField('College Name', max_length=1000, null=True, blank=True)
    designation   = models.CharField('Designation', max_length=1000, null=True, blank=True)
    experience    = models.CharField('Experience', max_length=1000, null=True, blank=True)
    uploaded_on   = models.DateTimeField('Uploaded On', auto_now_add=True)
    total_experience  = models.CharField('Total Experience (in Years)', max_length=1000, null=True, blank=True)
    file_hash = models.CharField(max_length=64,unique=True)



    def __str__(self):
            return str(self.name)
    def save(self, *args, **kwargs):
        if not self.file_hash:
            self.file_hash = self.generate_file_hash()
        super().save(*args, **kwargs)

    def generate_file_hash(self):
        hasher = hashlib.sha256()
        for chunk in self.resume.chunks():
            hasher.update(chunk)
        return hasher.hexdigest()

class UploadResumeModelForm(forms.ModelForm):
    class Meta:
        model = Resume
        fields = ['resume']
        widgets = {
            'resume': forms.ClearableFileInput(attrs={'multiple': True}),
        }