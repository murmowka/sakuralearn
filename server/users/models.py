from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    """
    Расширенный профиль пользователя с информацией об обучении.
    """
    LEVEL_CHOICES = [
        ('beginner', 'Начинающий'),
        ('elementary', 'Элементарный'),
        ('intermediate', 'Средний'),
        ('upper_intermediate', 'Выше среднего'),
        ('advanced', 'Продвинутый'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    study_streak = models.IntegerField(default=0)
    words_learned = models.IntegerField(default=0)
    hours_studied = models.FloatField(default=0.0)
    daily_goal = models.CharField(
        max_length=50,
        default='30 минут',
        help_text='Ежедневная цель обучения'
    )
    notifications_enabled = models.BooleanField(default=True)
    dark_theme = models.BooleanField(default=False)
    show_tips = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
    
    def __str__(self):
        return f'Профиль {self.user.username}'

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)