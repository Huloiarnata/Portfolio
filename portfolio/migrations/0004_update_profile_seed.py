from django.db import migrations

def update_profile(apps, schema_editor):
    Profile = apps.get_model('portfolio', 'Profile')
    p = Profile.objects.filter(pk=1).first()
    if p:
        # Set real values now that fields are properly blank-able
        p.linkedin = 'linkedin.com/in/ronitkumar710'
        p.stat1_value = '$500M'
        p.stat1_label = 'Revenue Preserved'
        p.stat2_value = '240%'
        p.stat2_label = 'Cache Hit Improvement'
        p.stat3_value = '50K+'
        p.stat3_label = 'IoT Data Entries'
        p.save()

class Migration(migrations.Migration):
    dependencies = [('portfolio', '0003_profile_v2')]
    operations = [migrations.RunPython(update_profile, migrations.RunPython.noop)]
