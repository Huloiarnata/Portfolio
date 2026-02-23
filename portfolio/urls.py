from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('admin-panel/login/', views.admin_login, name='admin_login'),
    path('admin-panel/logout/', views.admin_logout, name='admin_logout'),
    path('admin-panel/', views.admin_panel, name='admin_panel'),
    path('api/profile/', views.api_save_profile, name='api_profile'),
    path('api/upload-photo/', views.api_upload_photo, name='api_upload_photo'),
    path('api/education/', views.api_save_education, name='api_education'),
    path('api/skills/', views.api_save_skills, name='api_skills'),
    path('api/experience/', views.api_save_experience, name='api_experience'),
    path('api/projects/', views.api_save_projects, name='api_projects'),
    path('api/research/', views.api_save_research, name='api_research'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
