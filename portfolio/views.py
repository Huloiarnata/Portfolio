import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.conf import settings
from .models import (
    Profile, Education, SkillCategory, Skill,
    Experience, ExperiencePoint, Project, Research
)


# ── PUBLIC ────────────────────────────────────────────────────────────────────

def index(request):
    profile = Profile.objects.first()
    education = Education.objects.all()
    skill_categories = SkillCategory.objects.prefetch_related('skills').all()
    experiences = Experience.objects.prefetch_related('points').all()
    projects = Project.objects.all()
    research = Research.objects.all()
    return render(request, 'index.html', {
        'profile': profile,
        'education': education,
        'skill_categories': skill_categories,
        'experiences': experiences,
        'projects': projects,
        'research': research,
    })


# ── AUTH ──────────────────────────────────────────────────────────────────────

def admin_login(request):
    if request.session.get('is_admin'):
        return redirect('admin_panel')
    error = None
    if request.method == 'POST':
        if request.POST.get('password', '') == settings.ADMIN_PASSWORD:
            request.session['is_admin'] = True
            request.session.set_expiry(86400 * 7)
            return redirect('admin_panel')
        error = 'Incorrect password.'
    return render(request, 'admin_login.html', {'error': error})


def admin_logout(request):
    request.session.flush()
    return redirect('admin_login')


def admin_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.session.get('is_admin'):
            return redirect('admin_login')
        return view_func(request, *args, **kwargs)
    return wrapper


@admin_required
def admin_panel(request):
    return render(request, 'admin_panel.html', {
        'profile': Profile.objects.first(),
        'education': Education.objects.all(),
        'skill_categories': SkillCategory.objects.prefetch_related('skills').all(),
        'experiences': Experience.objects.prefetch_related('points').all(),
        'projects': Project.objects.all(),
        'research': Research.objects.all(),
    })


# ── ADMIN API ─────────────────────────────────────────────────────────────────

def admin_api(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.session.get('is_admin'):
            return JsonResponse({'error': 'Unauthorized'}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper


@admin_api
@require_http_methods(['POST'])
def api_upload_photo(request):
    profile, _ = Profile.objects.get_or_create(pk=1)
    if 'photo' in request.FILES:
        profile.photo = request.FILES['photo']
        profile.save()
        return JsonResponse({'ok': True, 'url': profile.photo.url})
    return JsonResponse({'error': 'No file'}, status=400)


@admin_api
@require_http_methods(['POST'])
def api_save_profile(request):
    data = json.loads(request.body)
    profile, _ = Profile.objects.get_or_create(pk=1)
    for field in ['name', 'title', 'tagline', 'linkedin', 'github',
                  'google_scholar', 'twitter', 'website', 'resume_link',
                  'stat1_value', 'stat1_label', 'stat2_value', 'stat2_label',
                  'stat3_value', 'stat3_label']:
        if field in data:
            setattr(profile, field, data[field])
    profile.save()
    return JsonResponse({'ok': True})


@admin_api
@require_http_methods(['POST'])
def api_save_education(request):
    data = json.loads(request.body)
    Education.objects.all().delete()
    for i, item in enumerate(data):
        Education.objects.create(
            institution=item.get('institution', ''),
            location=item.get('location', ''),
            degree=item.get('degree', ''),
            grade=item.get('grade', ''),
            year=item.get('year', ''),
            description=item.get('description', ''),
            link=item.get('link', ''),
            order=i,
        )
    return JsonResponse({'ok': True})


@admin_api
@require_http_methods(['POST'])
def api_save_skills(request):
    data = json.loads(request.body)
    SkillCategory.objects.all().delete()
    for i, cat in enumerate(data):
        category = SkillCategory.objects.create(name=cat['name'], order=i)
        for j, skill_name in enumerate(cat.get('skills', [])):
            Skill.objects.create(category=category, name=skill_name, order=j)
    return JsonResponse({'ok': True})


@admin_api
@require_http_methods(['POST'])
def api_save_experience(request):
    data = json.loads(request.body)
    Experience.objects.all().delete()
    for i, item in enumerate(data):
        exp = Experience.objects.create(
            company=item.get('company', ''),
            role=item.get('role', ''),
            team=item.get('team', ''),
            location=item.get('location', ''),
            start_date=item.get('start_date', ''),
            end_date=item.get('end_date', 'Present'),
            link=item.get('link', ''),
            order=i,
        )
        for j, point_text in enumerate(item.get('points', [])):
            if point_text.strip():
                ExperiencePoint.objects.create(experience=exp, text=point_text, order=j)
    return JsonResponse({'ok': True})


@admin_api
@require_http_methods(['POST'])
def api_save_projects(request):
    data = json.loads(request.body)
    Project.objects.all().delete()
    for i, item in enumerate(data):
        Project.objects.create(
            name=item.get('name', ''),
            tech=item.get('tech', ''),
            description=item.get('description', ''),
            link=item.get('link', ''),
            github_link=item.get('github_link', ''),
            order=i,
        )
    return JsonResponse({'ok': True})


@admin_api
@require_http_methods(['POST'])
def api_save_research(request):
    data = json.loads(request.body)
    Research.objects.all().delete()
    for i, item in enumerate(data):
        Research.objects.create(
            title=item.get('title', ''),
            publisher=item.get('publisher', ''),
            year=item.get('year', ''),
            description=item.get('description', ''),
            link=item.get('link', ''),
            order=i,
        )
    return JsonResponse({'ok': True})
