from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('portfolio', '0002_seed_data')]

    operations = [
        # Profile new fields
        migrations.AddField('Profile', 'photo', models.ImageField(blank=True, null=True, upload_to='profile/')),
        migrations.AddField('Profile', 'github', models.CharField(blank=True, max_length=300)),
        migrations.AddField('Profile', 'google_scholar', models.CharField(blank=True, max_length=300)),
        migrations.AddField('Profile', 'twitter', models.CharField(blank=True, max_length=300)),
        migrations.AddField('Profile', 'website', models.CharField(blank=True, max_length=300)),
        migrations.AddField('Profile', 'resume_link', models.CharField(blank=True, max_length=300)),
        migrations.AlterField('Profile', 'linkedin', models.CharField(blank=True, max_length=300)),
        migrations.AlterField('Profile', 'stat1_value', models.CharField(blank=True, max_length=20)),
        migrations.AlterField('Profile', 'stat1_label', models.CharField(blank=True, max_length=50)),
        migrations.AlterField('Profile', 'stat2_value', models.CharField(blank=True, max_length=20)),
        migrations.AlterField('Profile', 'stat2_label', models.CharField(blank=True, max_length=50)),
        migrations.AlterField('Profile', 'stat3_value', models.CharField(blank=True, max_length=20)),
        migrations.AlterField('Profile', 'stat3_label', models.CharField(blank=True, max_length=50)),
        # Education new fields
        migrations.AddField('Education', 'description', models.TextField(blank=True)),
        migrations.AddField('Education', 'link', models.URLField(blank=True)),
        migrations.AlterField('Education', 'grade', models.CharField(blank=True, max_length=20)),
        # Experience new fields
        migrations.AddField('Experience', 'link', models.URLField(blank=True)),
        migrations.AlterField('Experience', 'location', models.CharField(blank=True, max_length=100)),
        # Project new field
        migrations.AddField('Project', 'github_link', models.URLField(blank=True)),
    ]
