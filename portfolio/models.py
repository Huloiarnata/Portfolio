from django.db import models


class Profile(models.Model):
    name = models.CharField(max_length=100, default='Ronit Kumar')
    title = models.CharField(max_length=200, default='Software Engineer')
    tagline = models.TextField(default='Building robust distributed systems at scale.')
    photo = models.ImageField(upload_to='profile/', blank=True, null=True)

    # Social links
    linkedin       = models.CharField(max_length=300, blank=True)
    github         = models.CharField(max_length=300, blank=True)
    google_scholar = models.CharField(max_length=300, blank=True)
    twitter        = models.CharField(max_length=300, blank=True)
    website        = models.CharField(max_length=300, blank=True)
    resume_link    = models.CharField(max_length=300, blank=True)

    # Optional highlight stats (leave blank to hide)
    stat1_value = models.CharField(max_length=20, blank=True)
    stat1_label = models.CharField(max_length=50, blank=True)
    stat2_value = models.CharField(max_length=20, blank=True)
    stat2_label = models.CharField(max_length=50, blank=True)
    stat3_value = models.CharField(max_length=20, blank=True)
    stat3_label = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Profile'


class Education(models.Model):
    institution = models.CharField(max_length=200)
    location    = models.CharField(max_length=100)
    degree      = models.CharField(max_length=200)
    grade       = models.CharField(max_length=20, blank=True)
    year        = models.CharField(max_length=20, blank=True)
    description = models.TextField(blank=True)
    link        = models.URLField(blank=True)
    order       = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.degree} – {self.institution}"


class SkillCategory(models.Model):
    name  = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Skill Categories'

    def __str__(self):
        return self.name


class Skill(models.Model):
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills')
    name     = models.CharField(max_length=100)
    order    = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class Experience(models.Model):
    company    = models.CharField(max_length=200)
    role       = models.CharField(max_length=200)
    team       = models.CharField(max_length=200, blank=True)
    location   = models.CharField(max_length=100, blank=True)
    start_date = models.CharField(max_length=20)
    end_date   = models.CharField(max_length=20, default='Present')
    link       = models.URLField(blank=True)
    order      = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.role} @ {self.company}"


class ExperiencePoint(models.Model):
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='points')
    text       = models.TextField()
    order      = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']


class Project(models.Model):
    name        = models.CharField(max_length=200)
    tech        = models.CharField(max_length=300)
    description = models.TextField()
    link        = models.URLField(blank=True)
    github_link = models.URLField(blank=True)
    order       = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class Research(models.Model):
    title       = models.CharField(max_length=300)
    publisher   = models.CharField(max_length=200)
    year        = models.CharField(max_length=10)
    description = models.TextField()
    link        = models.URLField(blank=True)
    order       = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Research'

    def __str__(self):
        return self.title
