# Generated by Django 3.2.4 on 2024-05-21 02:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0010_alter_blogpost_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogpost',
            name='category',
            field=models.ForeignKey(db_constraint=False, on_delete=django.db.models.deletion.PROTECT, to='blog.category'),
        ),
    ]
