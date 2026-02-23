from django.db import migrations

def seed_data(apps, schema_editor):
    Profile = apps.get_model('portfolio', 'Profile')
    Education = apps.get_model('portfolio', 'Education')
    SkillCategory = apps.get_model('portfolio', 'SkillCategory')
    Skill = apps.get_model('portfolio', 'Skill')
    Experience = apps.get_model('portfolio', 'Experience')
    ExperiencePoint = apps.get_model('portfolio', 'ExperiencePoint')
    Project = apps.get_model('portfolio', 'Project')
    Research = apps.get_model('portfolio', 'Research')

    Profile.objects.create(
        name='Ronit Kumar',
        title='Software Engineer',
        tagline='Building robust distributed systems at scale.\nFrom kernel daemons to agentic workflows.',
        linkedin='linkedin.com/in/ronitkumar710',
        phone='+91 8010928824',
        stat1_value='$500M', stat1_label='Revenue Preserved',
        stat2_value='240%', stat2_label='Cache Hit Improvement',
        stat3_value='50K+', stat3_label='IoT Data Entries',
    )

    Education.objects.create(
        institution='SRM Institute of Science and Technology',
        location='Chennai, India',
        degree='B.Tech. – Computer Science and Engineering',
        grade='8.89 / 10',
        year='2022 – 2026',
        order=0,
    )

    for i, (cat, skills) in enumerate([
        ('Languages', ['C', 'C++', 'Go', 'Python', 'SQL']),
        ('Core CS', ['Data Structures', 'OS', 'Concurrency', 'Memory Management', 'File Systems']),
        ('Systems & Tools', ['Linux', 'FreeBSD', 'GDB', 'DTrace', 'Valgrind', 'Git', 'Makefile', 'JIRA']),
    ]):
        cat_obj = SkillCategory.objects.create(name=cat, order=i)
        for j, s in enumerate(skills):
            Skill.objects.create(category=cat_obj, name=s, order=j)

    exp1 = Experience.objects.create(
        company='Dell Technologies', role='Software Engineer 1',
        team='Infrastructure Solutions Group – Powerscale OneFS',
        location='Bengaluru, India', start_date='2024', end_date='Present', order=0,
    )
    for j, pt in enumerate([
        'Developed and owned end-to-end Productization of Slow-OPs monitoring system, a core daemon that enhanced cluster-wide transparency by collecting real-time performance data when nodes experience slowdowns, preserving $500M in client revenue.',
        'Served as Backup Scrum Lead during release cycles, coordinating daily stand-ups, facilitating cross-team communication, and leading knowledge transfer sessions to accelerate engineering onboarding.',
        'Designed and executed an agentic workflow for automated defect assignment using a custom cost matrix and Hungarian Algorithm to intelligently distribute workload, reducing initial triage time.',
    ]):
        ExperiencePoint.objects.create(experience=exp1, text=pt, order=j)

    exp2 = Experience.objects.create(
        company='Dell Technologies', role='Software Engineering Intern',
        team='Infrastructure Solutions Group – Powerscale OneFS',
        location='Bengaluru, India', start_date='2023', end_date='2024', order=1,
    )
    for j, pt in enumerate([
        'Achieved a 240% improvement in cache hit ratio by implementing cache partitioning and an optimized eviction policy, reducing redundant disk I/O.',
        'Built a multithreaded utility for cluster-wide quota analysis using optimized system B-Tree traversal.',
    ]):
        ExperiencePoint.objects.create(experience=exp2, text=pt, order=j)

    Project.objects.create(
        name='Heap Memory Manager in Linux',
        tech='C · Linux · System Calls',
        description='Implemented a user-space heap allocator in C using linked-list bookkeeping and block coalescing to minimize internal and external fragmentation.',
        order=0,
    )
    Project.objects.create(
        name='Sunshine Renewable Guide',
        tech='Flutter · Google Auth · Firebase · APIs',
        description='Built a Flutter app integrating APIs to deliver renewable energy insights and location-based meteorological data – aiding in informed decisions about installing sustainable equipment.',
        order=1,
    )

    Research.objects.create(
        title='FarmSurveil: An IoT and AI-Based Tool for Precision Farming',
        publisher='AIP – Awaiting Publication',
        year='2025',
        description='Developed a low-cost IoT tool for Indian farmers using ESP32, SHT31, BMP280, K30 CO2 sensor, and a camera module. Captured over 50,000 data entries enabling real-time cloud monitoring via ThingSpeak.',
        order=0,
    )
    Research.objects.create(
        title='Live Tracking of Metro Rail using Internet of Things',
        publisher='IEEE',
        year='2023',
        description='Designed a comprehensive metro system framework with a mobile application providing real-time location tracking, quickest route identification using Dijkstra\'s algorithm, and streamlined booking.',
        order=1,
    )


class Migration(migrations.Migration):
    dependencies = [('portfolio', '0001_initial')]
    operations = [migrations.RunPython(seed_data)]
