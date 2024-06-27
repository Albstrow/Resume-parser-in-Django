from django.contrib import admin
from .models import Resume,Profile

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    pass


admin.site.register(Profile)