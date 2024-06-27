# Generated by Django 4.1.2 on 2024-06-21 20:58

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('parser_app', '0004_auto_20240621_2056'),
    ]

    operations = [
        migrations.AlterField(
            model_name='resume',
            name='file_hash',
            field=models.CharField(max_length=64, unique=True),
        ),
        migrations.AlterField(
            model_name='resume',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
