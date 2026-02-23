from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Ronit Kumar', max_length=100)),
                ('title', models.CharField(default='Software Engineer', max_length=200)),
                ('tagline', models.TextField(default='Building robust distributed systems at scale.')),
                ('linkedin', models.CharField(default='linkedin.com/in/ronitkumar710', max_length=200)),
                ('phone', models.CharField(blank=True, max_length=30)),
                ('stat1_value', models.CharField(default='$500M', max_length=20)),
                ('stat1_label', models.CharField(default='Revenue Preserved', max_length=50)),
                ('stat2_value', models.CharField(default='240%', max_length=20)),
                ('stat2_label', models.CharField(default='Cache Hit Improvement', max_length=50)),
                ('stat3_value', models.CharField(default='50K+', max_length=20)),
                ('stat3_label', models.CharField(default='IoT Data Entries', max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('institution', models.CharField(max_length=200)),
                ('location', models.CharField(max_length=100)),
                ('degree', models.CharField(max_length=200)),
                ('grade', models.CharField(max_length=20)),
                ('year', models.CharField(blank=True, max_length=20)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={'ordering': ['order']},
        ),
        migrations.CreateModel(
            name='SkillCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={'ordering': ['order'], 'verbose_name_plural': 'Skill Categories'},
        ),
        migrations.CreateModel(
            name='Skill',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('order', models.PositiveIntegerField(default=0)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='skills', to='portfolio.skillcategory')),
            ],
            options={'ordering': ['order']},
        ),
        migrations.CreateModel(
            name='Experience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company', models.CharField(max_length=200)),
                ('role', models.CharField(max_length=200)),
                ('team', models.CharField(blank=True, max_length=200)),
                ('location', models.CharField(max_length=100)),
                ('start_date', models.CharField(max_length=20)),
                ('end_date', models.CharField(default='Present', max_length=20)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={'ordering': ['order']},
        ),
        migrations.CreateModel(
            name='ExperiencePoint',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('order', models.PositiveIntegerField(default=0)),
                ('experience', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='points', to='portfolio.experience')),
            ],
            options={'ordering': ['order']},
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('tech', models.CharField(max_length=300)),
                ('description', models.TextField()),
                ('link', models.URLField(blank=True)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={'ordering': ['order']},
        ),
        migrations.CreateModel(
            name='Research',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=300)),
                ('publisher', models.CharField(max_length=200)),
                ('year', models.CharField(max_length=10)),
                ('description', models.TextField()),
                ('link', models.URLField(blank=True)),
                ('order', models.PositiveIntegerField(default=0)),
            ],
            options={'ordering': ['order'], 'verbose_name_plural': 'Research'},
        ),
    ]
