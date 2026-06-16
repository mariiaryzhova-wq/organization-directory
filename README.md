# Каталог організацій (MVP1)

REST API для платформи "Каталог громадських організацій". MVP1 реалізує базовий функціонал: перегляд, подання, модерацію та масовий імпорт організацій, а також роботу з категоріями.

> Повна цільова специфікація системи (v1.0) описана в документі `SRS.md` і включає додатковий функціонал (автентифікація, ролі, рейтинги, коментарі, обране, райони), який **не входить до MVP1** і реалізується в наступних релізах.

---

## 1. Стек технологій

| Шар | Технологія |
|---|---|
| Runtime | Node.js (ES Modules) |
| Веб-фреймворк | Express 4 |
| ORM | Prisma (адаптер `@prisma/adapter-mariadb`) |
| База даних | MySQL / MariaDB |
| Валідація | express-validator |
| Завантаження файлів | multer (memory storage) |
| CORS | cors |
| Конфігурація | dotenv |
| Тестування | Jest, Supertest |

---

## 2. Структура проєкту

```
.
├── server.js                  # точка входу, запуск HTTP-сервера
├── src/
│   ├── app.js                 # конфігурація Express-застосунку
│   ├── controllers/
│   │   ├── organization.js    # контролер /api/organizations
│   │   └── category.js        # контролер /api/categories
│   ├── repositories/
│   │   ├── organization.js    # запити Prisma для organizations
│   │   └── category.js        # запити Prisma для categories
│   ├── routes/
│   │   ├── organizations.js
│   │   └── categories.js
│   ├── middleware/
│   │   ├── asyncHandler.js     # обгортка для async-контролерів
│   │   ├── errorHandler.js      # глобальний обробник помилок
│   │   ├── validate.js          # обробка результатів express-validator
│   │   └── upload.js            # конфігурація multer для CSV
│   ├── db/
│   │   ├── prisma.js            # Prisma Client + MariaDB adapter
│   │   └── definitions.js       # enum OrganizationStatus
│   └── utils/
│       ├── csvParser.js         # парсинг CSV для масового імпорту
│       ├── csvConfig.js         # ліміти та структура CSV
│       └── geoUtils.js          # обчислення bounding box для геофільтра
├── prisma/                     # схема та сид-дані (inserts.sql)
├── tests/
│   ├── unit/                   # юніт-тести (контролери, утиліти, middleware)
│   ├── integration/            # інтеграційні тести (routes + repositories + fake DB)
│   ├── api/                    # API-тести (повний HTTP цикл через Supertest)
│   └── mocks/fakePrisma.js     # фейкова Prisma для тестів без реальної БД
├── SRS.md                       # повна специфікація вимог (v1.0)
├── TEST_PLAN_CHECKLIST.md        # чек-листи та тест-кейси
└── TEST_REPORT.md                 # звіт про результати тестування
```

---

## 3. Встановлення та запуск

### 3.1 Передумови
- Node.js 18+
- MySQL/MariaDB сервер (для повноцінного запуску)

### 3.2 Встановлення залежностей

```bash
npm install
```

### 3.3 Конфігурація

Створіть файл `.env` на основі прикладу:

```env
PORT=3000
HOST=0.0.0.0
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=community_catalog

# Required by Prisma (migrate deploy, generate, studio)
DATABASE_URL=mysql://root:rootpassword@localhost:3306/community_catalog
```

> **Важливо:** якщо пароль БД містить символ `#`, значення в `.env` потрібно взяти в лапки: `DB_PASSWORD="пароль#тут"`.

### 3.4 Запуск через Docker Compose

```bash
docker compose up -d
```

Піднімається MySQL 8.4 (порт 3306) та застосунок (порт 3000).

### 3.5 Наповнення БД тестовими даними (seed)

```bash
node src/utils/geoParser/seed.js
```

Скрипт очищує таблиці `organizations`, `categories`, `organization_categories`, `locations` і завантажує дані з `inserts.sql`.

### 3.6 Запуск сервера

```bash
node server.js
```

Сервер запуститься на `http://<HOST>:<PORT>` (за замовчуванням `http://0.0.0.0:3000`).

---

## 4. Опис API (MVP1)

Базовий шлях: `/api`

### 4.1 Organizations

| Метод | Шлях | Опис |
|---|---|---|
| `GET` | `/api/organizations` | Список організацій з фільтрами та пагінацією |
| `GET` | `/api/organizations/:id` | Деталі організації за ID |
| `POST` | `/api/organizations` | Подання нової організації (статус `pending`) |
| `PUT` | `/api/organizations/:id/status` | Зміна статусу організації (модерація) |
| `POST` | `/api/organizations/import` | Масовий імпорт організацій з CSV-файлу |

**Query-параметри `GET /api/organizations`:**

| Параметр | Тип | Опис |
|---|---|---|
| `status` | string | `pending` \| `approved` \| `rejected` \| `archived` (за замовчуванням `approved`) |
| `category_id` | int | фільтр за категорією |
| `lat`, `lng`, `radiusKm` | float | геофільтр (усі три мають бути присутні одночасно) |
| `limit`, `offset` | int | пагінація |

**Приклад:**
```
GET /api/organizations?status=approved&category_id=3&lat=47.9387&lng=33.4324&radiusKm=5&limit=10&offset=0
```

**Тіло запиту `POST /api/organizations`:**
```json
{
  "name": "Green Future Foundation",
  "description": "Environmental organization...",
  "websiteUrl": "https://greenfuture.org",
  "categoryIds": [3],
  "locations": [
    {
      "street": "15 Poshtovyi Ave",
      "city": "Kryvyi Rih",
      "region": "Dnipropetrovsk Oblast",
      "postCode": "50000",
      "latitude": 47.9101,
      "longitude": 33.3918
    }
  ]
}
```

**Тіло запиту `PUT /api/organizations/:id/status`:**
```json
{ "status": "approved" }
```
або
```json
{ "status": "rejected", "rejectionReason": "Документи неповні" }
```

**`POST /api/organizations/import`** — `multipart/form-data`, поле `file` (CSV, UTF-8, ≤ 8MB, ≤ 500 рядків). Обов'язкова колонка: `name`. Опціональні: `description`, `website_url`.

### 4.2 Categories

| Метод | Шлях | Опис |
|---|---|---|
| `GET` | `/api/categories` | Список усіх категорій (сортування за `name`) |
| `GET` | `/api/categories/:id/organizations` | Підтверджені (`approved`) організації за категорією |

### 4.3 Формат помилок

Усі помилки повертаються у вигляді:
```json
{
  "errors": [
    { "field": "name", "message": "Опис помилки" }
  ]
}
```

---

## 5. Тестування

```bash
npm test                # усі тести з покриттям
npm run test:unit        # юніт-тести
npm run test:integration # інтеграційні тести
npm run test:api          # API-тести (Supertest)
```

Детальні чек-листи, тест-кейси та результати — у `TEST_PLAN_CHECKLIST.md` та `TEST_REPORT.md`.

---

## 6. Відомі обмеження MVP1

- Відсутня автентифікація/авторизація (JWT, ролі `user`/`admin`) — усі ендпоінти модерації наразі публічні.
- Відсутні модулі Users, Ratings, Comments, Favorites, Districts.
- Виявлено критичні дефекти у `POST /api/organizations/import` та `GET /api/categories/:id/organizations` (див. `TEST_REPORT.md`, BUG-01, BUG-02).

Повний перелік відмінностей між MVP1 та цільовою специфікацією v1.0 наведено в `SRS.md`, розділ "Статус реалізації".

400 Bad Request: { errors: [{ field, message }] }.

Валідація форм використовує express-validator.

Парсинг CSV підтримує файли до 8MB у кодуванні UTF-8 (максимум 500 рядків).
