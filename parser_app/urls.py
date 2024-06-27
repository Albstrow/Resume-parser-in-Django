
from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import home, profile, RegisterView


urlpatterns = [
    path('',views.main,name='home'),
    path('home/', views.homepage, name='homepage'),
    path('search/',views.search,name='resume-search'),
    # path('home', home, name='users-home'),
    path('register/', RegisterView.as_view(), name='users-register'),
    path('profile/', profile, name='users-profile'),
    path('demo/',views.demo,name="demo"),
    path('contact/',views.contact,name="contact"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
