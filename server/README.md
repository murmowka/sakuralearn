# SakuraLearn Django Backend

Это бэкенд-приложение для SakuraLearn, написанное на Django с использованием Django REST Framework.

## Установка и запуск

### 1. Активация виртуального окружения

```bash
cd /path/to/server
source venv/bin/activate  # На Linux/Mac
# или
venv\Scripts\activate  # На Windows
```

### 2. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 3. Применение миграций

```bash
python manage.py migrate
```

### 4. Создание суперпользователя (опционально)

```bash
python manage.py createsuperuser
```

### 5. Запуск сервера разработки

```bash
python manage.py runserver 0.0.0.0:8000
```

Сервер будет доступен по адресу: `http://localhost:8000`

## API Endpoints

### Аутентификация

- **POST** `/api/auth/register/` - Регистрация нового пользователя
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "password123",
    "password_confirm": "password123"
  }
  ```

- **POST** `/api/auth/login/` - Вход пользователя
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/logout/` - Выход пользователя (требует аутентификации)

- **GET** `/api/auth/me/` - Получение информации о текущем пользователе (требует аутентификации)

### Профиль пользователя

- **GET** `/api/profile/get_profile/` - Получение профиля текущего пользователя (требует аутентификации)

- **PATCH** `/api/profile/update_profile/` - Обновление профиля (требует аутентификации)
  ```json
  {
    "level": "intermediate",
    "daily_goal": "1 час",
    "notifications_enabled": true,
    "dark_theme": false,
    "show_tips": true
  }
  ```

- **PATCH** `/api/profile/update_user_info/` - Обновление информации о пользователе (требует аутентификации)
  ```json
  {
    "first_name": "John",
    "email": "newemail@example.com"
  }
  ```

## Структура проекта

```
server/
├── sakura_backend/       # Основной проект Django
│   ├── settings.py       # Настройки проекта
│   ├── urls.py          # Главные URL маршруты
│   └── wsgi.py          # WSGI конфигурация
├── users/               # Приложение для управления пользователями
│   ├── models.py        # Модели (User, UserProfile)
│   ├── views.py         # API представления
│   ├── serializers.py   # Сериализаторы для API
│   ├── urls.py          # URL маршруты приложения
│   └── admin.py         # Конфигурация Django Admin
├── manage.py            # Утилита управления Django
├── db.sqlite3           # База данных SQLite
└── requirements.txt     # Зависимости проекта
```

## CORS Configuration

Бэкенд настроен для работы с фронтенд-приложением на следующих адресах:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

Если вы запускаете фронтенд на другом адресе, добавьте его в `CORS_ALLOWED_ORIGINS` в `sakura_backend/settings.py`.

## Аутентификация

Приложение использует **Session-based authentication** (аутентификация на основе сессий). Когда пользователь успешно входит, Django создает сессию и отправляет cookie с идентификатором сессии. Все последующие запросы должны включать этот cookie.

## Администраторская панель

Доступна по адресу: `http://localhost:8000/admin`

Используйте учетные данные суперпользователя для входа.

## Разработка

### Создание новой миграции

```bash
python manage.py makemigrations
```

### Применение миграций

```bash
python manage.py migrate
```

### Запуск тестов

```bash
python manage.py test
```

## Производство

Для развертывания на продакшене:

1. Установите `DEBUG = False` в `settings.py`
2. Установите правильный `SECRET_KEY`
3. Добавьте домены в `ALLOWED_HOSTS`
4. Используйте production-ready WSGI сервер (gunicorn, uWSGI и т.д.)
5. Настройте HTTPS
6. Используйте production-ready базу данных (PostgreSQL, MySQL и т.д.)

## Лицензия

MIT
