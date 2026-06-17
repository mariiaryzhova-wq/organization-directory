import { parseCSV } from '../../src/utils/csvParser.js';

describe('UNIT: utils/csvParser.parseCSV', () => {
    test('TC-U07: коректно парсить валідний CSV з усіма колонками', async () => {
        const csv = 'name,description,website_url\nGreen Future,Eco org,https://greenfuture.org\n';
        const { rows, errors } = await parseCSV(Buffer.from(csv, 'utf-8'));

        expect(errors).toHaveLength(0);
        expect(rows).toHaveLength(1);
        expect(rows[0].name).toBe('Green Future');
        expect(rows[0].websiteUrl).toBe('https://greenfuture.org');
    });

    test('TC-U08: парсить CSV лише з обов\'язковою колонкою name', async () => {
        const csv = 'name\nCodeBridge Academy\n';
        const { rows, errors } = await parseCSV(Buffer.from(csv, 'utf-8'));

        expect(errors).toHaveLength(0);
        expect(rows[0].name).toBe('CodeBridge Academy');
    });

    test('TC-U09: повертає помилку, якщо відсутня обов\'язкова колонка name', async () => {
        const csv = 'description,website_url\nSome description,https://example.com\n';
        const { rows, errors } = await parseCSV(Buffer.from(csv, 'utf-8'));

        expect(rows).toHaveLength(0);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].field).toBe('file');
    });

    test('TC-U10: повертає помилку для порожнього файлу', async () => {
        const { rows, errors } = await parseCSV(Buffer.from('', 'utf-8'));

        expect(rows).toHaveLength(0);
        expect(errors[0].error).toMatch(/empty/i);
    });

    test('TC-U11: повертає лише заголовки без рядків даних -> 0 рядків, без помилок', async () => {
        const csv = 'name,description\n';
        const { rows, errors } = await parseCSV(Buffer.from(csv, 'utf-8'));

        expect(rows).toHaveLength(0);
        expect(errors).toHaveLength(0);
    });

    test('TC-U12: повертає помилку при перевищенні MAX_ROWS (500)', async () => {
        const header = 'name\n';
        const dataRows = Array.from({ length: 501 }, (_, i) => `Org ${i}`).join('\n');
        const csv = header + dataRows + '\n';

        const { rows, errors } = await parseCSV(Buffer.from(csv, 'utf-8'));

        expect(rows.length).toBeLessThanOrEqual(500);
        expect(errors.some(e => /maximum/i.test(e.error))).toBe(true);
    });

    test('TC-U13: обрізає пробіли у значеннях колонок', async () => {
        const csv = 'name,description\n  Health First  ,  Some description  \n';
        const { rows } = await parseCSV(Buffer.from(csv, 'utf-8'));

        expect(rows[0].name).toBe('Health First');
        expect(rows[0].description).toBe('Some description');
    });
});
test('Мой девятнадцатый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});
