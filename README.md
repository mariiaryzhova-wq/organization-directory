# Каталог організацій — Backend API

> Цей репозиторій містить backend-частину WEB-додатка, який надає користувачам доступ до інформації про різні організації в інтерактивному вигляді. Проєкт реалізує RESTful API для створення, модерації та перегляду каталогу організацій.

## Архітектура та структура проєкту

Детальний опис архітектури (MVC) та призначення кожної папки чи файлу винесено в окремий документ: **Architecture.MD.**

## Технічний стек

* Runtime: [Node.js](https://nodejs.org/en/docs)
* Framework: [Express.js](https://expressjs.com/)
* База даних: [MySQL](https://dev.mysql.com/doc/
* ORM: [Prisma](https://www.prisma.io/docs)
* Валідація: [express-validator](https://www.prisma.io/docs)
* Обробка файлів:
  - [multer](https://www.prisma.io/docs) (multipart/form-data)
  - [csv-parser](https://www.npmjs.com/package/csv-parser) (парсинг CSV-файлів)

### Як запустити локально

1. Клонуйте репозиторій та перейдіть у папку проєкту.

2. Встановіть залежності:
```shell
npm install
```

3. Налаштуйте змінні середовища:
Переконайтеся, що в корені проєкту є файл .env із наступним вмістом (замініть дані на свої):
```shell
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=secret
DB_NAME=catalog_db
DB_PORT=3306
```

4. Запустіть сервер:
```shell
node index.js
```

### Створення локальної бази даних

1. Запустіть MySQL контейнер:
```shell
docker compose up -d

```
2. Переконайтеся, що контейнер запущений:
```shell
docker compose ps
```

3. Щоб зупинити базу даних:
```shell
docker compose down
```

### Розгортання схеми бази даних
1.Застосуйте Prisma міграції, щоб створити структуру таблиць у базі даних:
```shell
npm run prisma:migrate
```
2. Згенеруйте Prisma Client:
```shell
npm run prisma:generate
```
3. Запустіть Prisma Studio:
```shell
npm run prisma:studio
```

### Наповнення бази даних тестовими даними (Seeds sample-data.sql)
Використовуйте команду для запуску скрипта наповнення бази даних:
```shell
npm run db:seed
```

Скрипт читає дані з `src/db/sample-data.sql` і виконує їх у локальній базі, налаштованій через `.env`.

## Основні Ендпоінти (API)

### Каталог (Публічні)
**GET /api/organizations?category_id=<number>** — Отримати список підтверджених організацій (фільтрація по категорії).

**GET /api/organizations/:id** — Детальна інформація про організацію.

**GET /api/categories** — Отримати всі категорії.

### Додавання (Публічні/Користувацькі)
**POST /api/organizations** — Створити заявку на нову організацію (статус pending).

**POST /api/organizations/import** — Масове завантаження організацій через CSV файл.

### Модерація (Адміністратор)
**GET /api/organizations?status=pending** — Перегляд заявок, що очікують підтвердження.

**PUT /api/organizations/:id/state** — Зміна статусу організації (approved або rejected + rejection_reason).

**PUT /api/organizations/:id/state** — Зміна статусу організації (pending, approved, rejected, archived).

## Правила валідації та обробки помилок
Всі помилки валідації та сервера повертаються в єдиному форматі:

400 Bad Request: { errors: [{ field, message }] }.

Валідація форм використовує express-validator.

Парсинг CSV підтримує файли до 8MB у кодуванні UTF-8 (максимум 500 рядків).
