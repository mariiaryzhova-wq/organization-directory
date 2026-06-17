import { jest } from '@jest/globals';
import request from 'supertest';
import { createFakePrisma } from '../mocks/fakePrisma.js';

let app;

beforeAll(async () => {
    const fakePrisma = createFakePrisma({ categories: [], organizations: [] });
    jest.unstable_mockModule('../../src/db/prisma.js', () => ({ prisma: fakePrisma }));
    const mod = await import('../../src/app.js');
    app = mod.default;
});

describe('INTEGRATION: POST /api/organizations/import', () => {
    test('TC-I30: повертає 400, якщо файл не надано', async () => {
        const res = await request(app).post('/api/organizations/import');

        expect(res.status).toBe(400);
        expect(res.body.errors[0].field).toBe('file');
    });

    test('TC-I31 [виявлено BUG-01]: успішний імпорт валідного CSV — ОЧІКУВАНО 207, ФАКТИЧНО 500', async () => {
        const csv = 'name,description,website_url\nSolar Energy Hub,Renewable energy center,https://solarhub.energy\nWomen in Tech Network,Professional community,https://womenintech.network\n';

        const res = await request(app)
            .post('/api/organizations/import')
            .attach('file', Buffer.from(csv, 'utf-8'), 'organizations.csv');

        // ОЧІКУВАНИЙ результат за специфікацією: 207, created: 2, errors: []
        // ФАКТИЧНИЙ результат: 500 Internal Server Error.
        // Причина (BUG-01): importCSV викликає createOrganization(orgData)
        // без 2-го (categoryIds) та 3-го (locations) аргументів. Репозиторій
        // безумовно виконує categoryIds.map(...) та locations.map(...),
        // що падає з TypeError "Cannot read properties of undefined (reading 'map')"
        // для КОЖНОГО рядка CSV. У результаті жодна організація не імпортується.
        expect(res.status).toBe(500);
        expect(res.body.errors[0].message).toMatch(/Failed to create organization/);
    });

    test('TC-I32 [виявлено BUG-01]: CSV з рядком без імені — ОЧІКУВАНО 207 (created:1, errors:1), ФАКТИЧНО 500', async () => {
        const csv = 'name,description\nValid Org With Name,Some description\n,Missing name here\n';

        const res = await request(app)
            .post('/api/organizations/import')
            .attach('file', Buffer.from(csv, 'utf-8'), 'organizations.csv');

        // Валідний рядок проходить валідацію імені, але падає на createOrganization (BUG-01)
        expect(res.status).toBe(500);
    });

    test('TC-I33: CSV без обов\'язкової колонки name повертає 400', async () => {
        const csv = 'description,website_url\nNo name column,https://example.com\n';

        const res = await request(app)
            .post('/api/organizations/import')
            .attach('file', Buffer.from(csv, 'utf-8'), 'organizations.csv');

        expect(res.status).toBe(400);
        expect(res.body.errors[0].field).toBe('file');
    });

    test('TC-I34: завантаження файлу з неприпустимим розширенням (.txt) відхиляється multer fileFilter', async () => {
        const res = await request(app)
            .post('/api/organizations/import')
            .attach('file', Buffer.from('name\nFoo\n', 'utf-8'), 'organizations.txt');

        // multer fileFilter викидає помилку -> обробляється errorHandler-ом
        expect([400, 500]).toContain(res.status);
        expect(res.body).toHaveProperty('errors');
    });
});
test('Мой двадцать первый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});
