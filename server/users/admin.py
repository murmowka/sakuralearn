from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'level', 'study_streak', 'words_learned', 'updated_at')
    list_filter = ('level', 'created_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Пользователь', {
            'fields': ('user',)
        }),
        ('Прогресс обучения', {
            'fields': ('level', 'study_streak', 'words_learned', 'hours_studied')
        }),
        ('Предпочтения', {
            'fields': ('daily_goal', 'notifications_enabled', 'dark_theme', 'show_tips')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
