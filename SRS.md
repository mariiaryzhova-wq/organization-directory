# Специфікація вимог до програмного забезпечення (SRS)
## Проєкт "Каталог організацій" — версія документа 1.0

---

## 1. Вступ

### 1.1 Мета документа
Цей документ описує функціональні та нефункціональні вимоги до системи "Каталог організацій" — веб-платформи, що дозволяє користувачам переглядати, оцінювати та залишати відгуки про місцеві організації (кафе, клуби, освітні платформи, благодійні фонди тощо), а адміністраторам — модерувати контент.

Документ базується на:
- "Специфікація API (v1.0) — Final Plan" (повна цільова специфікація, `final.docx`);
- фактичній реалізації MVP1 (вихідний код контролерів, репозиторіїв, маршрутів).

### 1.2 Область застосування
Специфікація охоплює:
- модель даних (ER-діаграма);
- REST API (ендпоінти, формати запитів/відповідей);
- критерії прийняття (Acceptance Criteria) для бізнес-логіки;
- обробку помилок.

### 1.3 Статус реалізації
У цьому документі кожен розділ/вимога позначається одним зі статусів:

| Позначення | Значення |
|---|---|
| Реалізовано (MVP1) | функціонал присутній у поточному вихідному коді |
| Реалізовано частково / з відхиленнями | функціонал присутній, але є дефекти або відмінності від специфікації |
| Не реалізовано (Roadmap) | заплановано на майбутні релізи, відсутнє в MVP1 |

---

## 2. Загальний опис системи

### 2.1 Параметри API

| Параметр | Значення (Specification v1.0) | MVP1 |
|---|---|---|
| Протокол | RESTful API (HTTPS) | Реалізовано: HTTP/REST (Express) |
| Формат обміну даними | JSON | Реалізовано |
| Автентифікація | JWT (Bearer Token) | Не реалізовано |
| Кодування | UTF-8 | Реалізовано |
| Ролі в системі | user, admin | Не реалізовано; усі ендпоінти публічні |

### 2.2 Ролі користувачів (цільова специфікація)

| Роль | Опис |
|---|---|
| Гість (неавторизований) | Перегляд каталогу, пошук, фільтрація |
| user | Подання заявок на організації, відгуки, рейтинги, обране |
| admin | Модерація організацій та відгуків, блокування користувачів |

Примітка: у MVP1 розмежування ролей відсутнє. Усі описані нижче ендпоінти модерації доступні без перевірки прав.

---

## 3. Модель даних (ER-діаграма)

```
ORGANIZATIONS ||--o{ LOCATIONS      : "has"
ORGANIZATIONS ||--o{ CONTACTS       : "has"
ORGANIZATIONS ||--o{ RATINGS        : "has stars"
ORGANIZATIONS ||--o{ COMMENTS       : "has text"
ORGANIZATIONS }o--|| CATEGORIES     : "belongs to"
LOCATIONS     }o--|| DISTRICTS      : "located in"
USERS         ||--o{ RATINGS        : "rates"
USERS         ||--o{ COMMENTS       : "writes"
USERS         ||--o{ FAVORITES      : "saves"
ORGANIZATIONS ||--o{ FAVORITES      : "is saved in"
USERS         ||--o{ ORGANIZATIONS  : "submits"
```

### 3.1 Сутність ORGANIZATIONS

| Поле | Тип | Специфікація v1.0 | MVP1 (Prisma) |
|---|---|---|---|
| id | int PK | є | є |
| name | string | є | є |
| description | text | є | є |
| website_url | string | є | є (websiteUrl) |
| category_id | int FK | є (1:N) | реалізовано як M:N через organization_categories |
| created_by_user_id | int FK | є | не реалізовано (немає Users) |
| logo_url | string | є | відсутнє |
| cover_url | string | є | відсутнє |
| rating | float | є | відсутнє (немає Ratings) |
| status | string | є | є (pending/approved/rejected/archived) |
| created_at | timestamp | є | є |
| social_links | json | — | присутнє в seed-даних, не описано в специфікації API |
| contacts | json/array | — (окрема таблиця CONTACTS) | присутнє як JSON-масив телефонів у organizations |
| working_hours | json | — | присутнє в seed-даних |
| rejection_reason | string | — | присутнє |

Відхилення моделі даних: специфікація v1.0 описує category_id як одну категорію (1:N) та окремі таблиці CONTACTS, RATINGS, COMMENTS, FAVORITES, DISTRICTS, USERS. MVP1 реалізує лише organizations, categories, organization_categories (M:N) та locations. Це архітектурне розширення/відхилення, яке слід узгодити та задокументувати окремо перед переходом до v1.0.

### 3.2 Сутність RATINGS (Roadmap, не реалізовано)
| Поле | Тип |
|---|---|
| id | int PK |
| org_id | int FK |
| user_id | int FK |
| value | int |
| created_at | timestamp |

### 3.3 Сутність COMMENTS (Roadmap, не реалізовано)
| Поле | Тип |
|---|---|
| id | int PK |
| org_id | int FK |
| user_id | int FK |
| comment | text |
| status | string |
| rejection_reason | string |
| created_at | timestamp |

### 3.4 Сутність CONTACTS (Roadmap; у MVP1 — JSON-поле contacts в organizations)
| Поле | Тип |
|---|---|
| id | int PK |
| org_id | int FK |
| type | string |
| value | string |

### 3.5 Сутність LOCATIONS (реалізовано в MVP1, у спрощеному вигляді)

| Поле | Специфікація v1.0 | MVP1 |
|---|---|---|
| id | int PK | є (locationId) |
| org_id | int FK | є (organizationId) |
| district_id | int FK | замінено текстовими полями city/region |
| address | string | розбито на street, postCode |
| working_hours | json | зберігається на рівні organizations, не locations |
| latitude / longitude | float | є |

### 3.6 Сутність DISTRICTS (Roadmap, не реалізовано)
### 3.7 Сутність CATEGORIES (реалізовано в MVP1: id, name)
### 3.8 Сутність USERS (Roadmap, не реалізовано)
### 3.9 Сутність FAVORITES (Roadmap, не реалізовано)

---

## 4. Функціональні вимоги

### 4.1 Модуль I. Discovery Service (Публічний доступ)

#### FR-1.1 — GET /dictionaries/{type} (Roadmap, не реалізовано)
Опис: Надання довідкових значень (districts, categories) для UI-компонентів Select/Dropdown.

Відповідь (200 OK):
```json
[
  { "id": 1, "name": "Центр" },
  { "id": 2, "name": "Пасічна" }
]
```
У MVP1 частково покрито через GET /api/categories, проте без параметра {type} та без довідника districts.

#### FR-1.2 — GET /organizations (реалізовано з відхиленнями; MVP1: GET /api/organizations)
Опис: Повернення списку компаній зі статусом approved (за замовчуванням).

Параметри запиту:

| Параметр (Specification v1.0) | MVP1 | Статус |
|---|---|---|
| category_id | category_id | реалізовано |
| district_id | — | не реалізовано |
| min_rating | — | не реалізовано (немає поля rating) |
| is_open | — | не реалізовано (немає обчислення working_hours) |
| search (case-insensitive) | — | не реалізовано |
| sort_by (rating/date/popularity) | — | фіксоване сортування createdAt desc; rating/popularity неможливі без відповідних полів |
| — | status | додано в MVP1 (потрібне для модерації) |
| — | lat, lng, radiusKm | додано в MVP1 (геопошук) |
| — | limit, offset | додано в MVP1 (пагінація; специфікація v1.0 описує page/per_page) |

Відповідь (Specification v1.0):
```json
{
  "data": [
    {
      "id": 101,
      "name": "Кафе Затишок",
      "category": "Кафе та ресторани",
      "district": "Центр",
      "logo_url": "https://cdn.example.com/logo1.png",
      "rating": 4.8,
      "is_open": true
    }
  ],
  "pagination": { "total": 120, "page": 1, "per_page": 10 }
}
```

Відповідь (MVP1, фактично):
```json
[
  {
    "id": 1,
    "name": "Green Future Foundation",
    "description": "...",
    "websiteUrl": "https://greenfuture.org",
    "status": "approved",
    "categories": [{ "id": 3, "name": "Environment" }],
    "locations": [{ "id": 1, "street": "...", "city": "Kryvyi Rih", "region": "...", "postCode": "50000", "latitude": 47.91, "longitude": 33.39 }]
  }
]
```
GAP-05: MVP1 повертає "сирий" масив без обгортки { data, pagination }. Поля category (рядок), district, logo_url, rating, is_open зі специфікації відсутні; замість них — масиви categories та locations.

#### FR-1.3 — GET /organizations/{id} (реалізовано з відхиленнями; MVP1: GET /api/organizations/:id)
Опис: Отримання повної інформації для детальної картки.

| Поле специфікації | MVP1 |
|---|---|
| contacts[] ({type, value}) | відсутнє |
| comments[] ({user, text, date}) | відсутнє |
| locations[].working_hours | відсутнє (working_hours не повертається у DTO локації) |
| rating, logo_url, cover_url | відсутнє |
| locations[].district | замінено city/region |

Базова структура (id, name, description, websiteUrl, categories, locations зі street/city/region/postCode/latitude/longitude) реалізована.

---

### 4.2 Модуль II. Client Interaction (Авторизовані операції)

#### FR-2.1 — POST /organizations (реалізовано з відхиленнями; MVP1: POST /api/organizations)
Логіка специфікації: Створює запис зі статусом pending. ID користувача береться з JWT.

| Поле специфікації | MVP1 |
|---|---|
| name, description, category_id, website_url | реалізовано (categoryIds[] замість одного category_id) |
| logo_url, cover_url | відсутнє |
| contacts[] | відсутнє |
| location.district_id, location.working_hours | відсутнє |
| location.address, location.latitude/longitude | MVP1 приймає масив locations[] зі street/city/region/postCode/latitude/longitude |
| Статус за замовчуванням pending | реалізовано в репозиторії (OrganizationStatus.pending) |
| created_by_user_id з JWT | не реалізовано (немає автентифікації) |

#### FR-2.2 — POST /reviews (Roadmap, не реалізовано)
Логіка: Розділення даних між RATINGS (перезапис останньої оцінки користувача, миттєвий перерахунок рейтингу) та COMMENTS (кожен запис — новий, статус pending).
Не реалізовано в MVP1. Жодних таблиць/ендпоінтів для рейтингів і коментарів немає.

#### FR-2.3 — DELETE /comments/{id} (Roadmap, не реалізовано)
Логіка: Ownership Validation — видалення лише власного коментаря (user_id з токена == автор).

#### FR-2.4 — PATCH /favorites/{org_id} (Roadmap, не реалізовано)
Опис: Toggle додавання/видалення організації зі списку обраного.
Відповідь (200 OK): { "status": "added/removed" }

---

### 4.3 Модуль III. Administrative Oversight (Керування та модерація)

Доступ дозволено виключно ролі admin (Specification v1.0). У MVP1 авторизація відсутня (GAP-02).

#### FR-3.1 — GET /admin/moderation (Roadmap, частково покрито)
Опис: Перелік усіх заявок зі статусом pending.
MVP1 дозволяє отримати той самий результат через GET /api/organizations?status=pending, але без перевірки ролі admin (публічний доступ — GAP-01).

#### FR-3.2 — PATCH /admin/organizations/{id}/status (реалізовано з відхиленнями; MVP1: PUT /api/organizations/:id/status)
Тіло запиту: { "status": "approved" } або { "status": "rejected", "rejectionReason": "..." }.

| Аспект | Статус |
|---|---|
| Метод HTTP | специфікація вимагає PATCH, MVP1 реалізує PUT |
| Валідація допустимих статусів | реалізовано (pending/approved/rejected/archived) |
| 404 для неіснуючого id | реалізовано |
| Перевірка ролі admin | не реалізовано (GAP-02) |
| Збереження rejectionReason | реалізовано |

#### FR-3.3 — PATCH /admin/organizations/{id} (Roadmap, не реалізовано)
Логіка: Пряме редагування полів організації адміністратором (назва, опис, контакти).
Не реалізовано — у MVP1 немає ендпоінта довільного редагування організації (лише зміна статусу).

#### FR-3.4 — PATCH /admin/comments/{id}/status (Roadmap, не реалізовано)
#### FR-3.5 — DELETE /admin/comments/{id} (Roadmap, не реалізовано)
#### FR-3.6 — PATCH /admin/users/{id}/block (Roadmap, не реалізовано)

---

### 4.4 Модуль "Масовий імпорт" (специфічно для MVP1, додатково до Specification v1.0)

#### FR-4.1 — POST /api/organizations/import (реалізовано з критичним дефектом)
Опис: Завантаження CSV-файлу (UTF-8, ≤ 8MB, ≤ 500 рядків) з колонками name (обов'язково), description, website_url (опціонально).

Логіка (за кодом):
1. Перевірка наявності файлу — 400, якщо відсутній.
2. Парсинг CSV (parseCSV) — перевірка обов'язкових колонок.
3. Валідація кожного рядка: name має бути присутній і не менше 2 символів.
4. Створення організацій для валідних рядків.
5. Відповідь 207 Multi-Status: { created: <кількість>, errors: [...] }.

BUG-01 (критичний): крок 4 викликає createOrganization(orgData) без 2-го та 3-го аргументів (categoryIds, locations), що в репозиторії призводить до TypeError: Cannot read properties of undefined (reading 'map') для кожного рядка. Жодна організація не створюється, ендпоінт повертає 500 замість 207. Деталі — TEST_REPORT.md, розділ "Дефекти".

---

## 5. Критерії прийняття (Acceptance Criteria)

### 5.1 Пошук та фільтрація (Discovery)

| AC | Опис | Статус MVP1 |
|---|---|---|
| AC 1.1 | У публічному доступі видимі лише організації зі статусом approved; pending/rejected — лише для адміна | Технічно можливо отримати pending/rejected через ?status=, без перевірки ролі (GAP-01) |
| AC 1.2 | Фільтр за районом повертає організації з активною філією у вказаному районі | район (district) не реалізовано; є геофільтр lat/lng/radiusKm |
| AC 1.3 | Пошук за назвою (search) є case-insensitive | параметр search не реалізовано |
| AC 1.4 | Статус "Відкрито" обчислюється на основі working_hours і поточного часу | не реалізовано |
| AC 1.5 | Фільтрація за мінімальним рейтингом | не реалізовано (немає поля rating) |
| AC 1.6 | Сортування за замовчуванням — за популярністю; можливе сортування за рейтингом/датою | фактичне сортування — фіксоване createdAt desc; sort_by не реалізовано |

### 5.2 Робота з відгуками та рейтингом

| AC | Опис | Статус MVP1 |
|---|---|---|
| AC 2.1 | Користувач може змінити оцінку; нове значення замінює старе | не реалізовано |
| AC 2.2 | Оцінка впливає на рейтинг миттєво, без модерації | не реалізовано |
| AC 2.3 | Текстовий коментар завжди проходить модерацію (pending -> публікація після approved) | не реалізовано |
| AC 2.4 | Коментарі зберігаються окремо, кожен — новий запис | не реалізовано |
| AC 2.5 | Користувач може видалити власний відгук; рейтинг перераховується | не реалізовано |

### 5.3 Збережене (Favorites)

| AC | Опис | Статус MVP1 |
|---|---|---|
| AC 3.1 | Toggle додавання/видалення без перезавантаження сторінки | не реалізовано |
| AC 3.2 | Синхронізація обраного з профілем на будь-якому пристрої | не реалізовано |

### 5.4 Подача заявки на додавання

| AC | Опис | Статус MVP1 |
|---|---|---|
| AC 4.1 | Форма подачі доступна лише зареєстрованим користувачам | не реалізовано (немає автентифікації — доступно всім) |
| AC 4.2 | Блокування відправки, якщо не заповнені: Назва, Категорія, Опис, хоча б одна адреса з районом, хоча б один номер телефону | Реалізовано лише: name (мін. 2 символи), categoryIds (непорожній масив). Валідація description, обов'язкової адреси та телефону відсутня |
| AC 4.3 | Після відправки — статус pending, видимий лише в черзі модерації | статус pending встановлюється; видимість у "черзі" — див. GAP-01 |

### 5.5 Адміністрування та модерація

| AC | Опис | Статус MVP1 |
|---|---|---|
| AC 5.1 | Dashboard адміністратора зі списком pending | дані доступні через ?status=pending, але без UI Dashboard та без перевірки ролі |
| AC 5.2 | Адмін може редагувати будь-які поля заявки | не реалізовано |
| AC 5.3 | Адмін може встановити approved або повністю видалити заявку | зміна статусу — реалізовано; видалення запису — не реалізовано |
| AC 5.4 | Адмін переглядає та модерує відгуки | не реалізовано |
| AC 5.5 | Адмін може видалити будь-який відгук | не реалізовано |
| AC 5.6 | Відхилені відгуки (rejected) автоматично видаляються через 30 днів (Cron Job) | не реалізовано |
| AC 5.7 | При відхиленні/блокуванні адмін вказує причину, яка зберігається та може бути показана користувачу | для організацій rejectionReason зберігається (реалізовано); для відгуків/блокування користувачів — не реалізовано (немає відповідних сутностей) |

### 5.6 Блокування користувачів (is_blocked)

| AC | Опис | Статус MVP1 |
|---|---|---|
| AC 6.1 | is_blocked = true блокує POST (відгуки, заявки) з помилкою 403 | не реалізовано (немає Users / is_blocked) |
| AC 6.2 | Заблокований користувач має доступ до GET та PATCH /favorites | не реалізовано |

---

## 6. Обробка помилок (Handling Exceptions)

| Код | Опис (Specification v1.0) | Статус MVP1 |
|---|---|---|
| 400 Bad Request | Помилка синтаксису / некоректний формат даних | реалізовано (express-validator + ручні перевірки) |
| 401 Unauthorized | Відсутній/прострочений токен | не реалізовано (немає автентифікації) |
| 403 Forbidden | Доступ до адмінки без прав / видалення чужого відгуку | не реалізовано |
| 404 Not Found | Ресурс не знайдено | реалізовано для organizations/categories |
| 409 Conflict | Порушення унікальності (наприклад, дублювання website_url) | не реалізовано (немає unique-перевірки на рівні API) |
| 422 Unprocessable Entity | Помилка бізнес-валідації (напр., відгук менше 5 слів) | не реалізовано |
| 500 Internal Server Error | Критична серверна помилка | реалізовано через errorHandler |

Формат відповіді з помилкою (фактичний, MVP1):
```json
{
  "errors": [
    { "field": "name", "message": "Опис помилки" }
  ]
}
```

---

## 7. Нефункціональні вимоги

| Вимога | Специфікація | MVP1 |
|---|---|---|
| Content-Type відповіді | application/json | реалізовано |
| Обробка невірного HTTP-методу | 405 Method Not Allowed | Express повертає 404 (GAP-04) |
| Час відповіді | 200-500 мс за нормальних умов | реалізовано (за результатами тестування, див. TEST_REPORT.md) |
| Кодування | UTF-8 | реалізовано |
| CORS | — | реалізовано (middleware cors) |

---

## 8. Перелік виявлених прогалин (Gaps) та дефектів (Bugs)

| ID | Тип | Опис | Серйозність |
|---|---|---|---|
| BUG-01 | Дефект | POST /api/organizations/import: createOrganization викликається без categoryIds/locations -> TypeError -> 500 замість 207 для будь-якого валідного CSV | Критична |
| BUG-02 | Дефект | GET /api/categories/:id/organizations: фільтр categories.some.id не відповідає схемі (потрібно categoryId) -> завжди повертає 0 організацій -> завжди 404 | Критична |
| GAP-01 | Прогалина (безпека) | GET /api/organizations?status=pending\|rejected доступний без перевірки ролі — витік даних модерації | Висока |
| GAP-02 | Прогалина (безпека) | PUT /api/organizations/:id/status доступний без автентифікації — будь-хто може схвалити/відхилити організацію | Висока |
| GAP-03 | Відхилення від специфікації | GET /api/categories/:id/organizations повертає 404 для порожнього результату; специфікація (TC-25) вимагає 200 + [] | Середня |
| GAP-04 | Відхилення від специфікації | Невірний HTTP-метод повертає 404 замість 405 Method Not Allowed | Низька |
| GAP-05 | Відхилення від специфікації | GET /api/organizations повертає "сирий" масив замість { data, pagination } | Середня |

---

## 9. Глосарій

| Термін | Опис |
|---|---|
| MVP1 | Мінімально життєздатний продукт, перша реалізована частина системи |
| DTO | Data Transfer Object — об'єкт, що повертається клієнту API |
| Bounding Box | Прямокутна область координат, що використовується для попередньої геофільтрації |
| Soft validation | Валідація на рівні express-validator перед виконанням бізнес-логіки |
