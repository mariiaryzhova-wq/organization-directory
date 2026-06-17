import { REQUIRED_COLUMNS, OPTIONAL_COLUMNS, MAX_ROWS } from './csvConfig.js';

const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];

// Перетворює рядок CSV "header" у назву колонки в camelCase
// website_url -> websiteUrl
function toCamelCase(header) {
    return header
        .trim()
        .toLowerCase()
        .replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * Парсить буфер CSV-файлу у масив об'єктів-рядків.
 * Перевіряє наявність обов'язкових колонок та обмеження по кількості рядків.
 *
 * @param {Buffer} buffer
 * @returns {Promise<{ rows: Array<object>, errors: Array<{row?: number, field?: string, error?: string, message?: string}> }>}
 */
export async function parseCSV(buffer) {
    const content = buffer.toString('utf-8').trim();

    if (!content) {
        return { rows: [], errors: [{ field: 'file', error: 'CSV file is empty' }] };
    }

    const lines = content.split(/\r?\n/).filter(line => line.length > 0);

    if (lines.length === 0) {
        return { rows: [], errors: [{ field: 'file', error: 'CSV file is empty' }] };
    }

    const headerLine = lines[0];
    const headers = headerLine.split(',').map(h => toCamelCase(h));

    const requiredCamel = REQUIRED_COLUMNS.map(toCamelCase);
    const missingColumns = requiredCamel.filter(col => !headers.includes(col));

    if (missingColumns.length > 0) {
        return {
            rows: [],
            errors: [{ field: 'file', error: `Missing required columns: ${missingColumns.join(', ')}` }]
        };
    }

    const dataLines = lines.slice(1);

    const errors = [];
    if (dataLines.length > MAX_ROWS) {
        errors.push({ field: 'file', error: `CSV exceeds maximum of ${MAX_ROWS} rows` });
    }

    const rows = dataLines.slice(0, MAX_ROWS).map((line) => {
        const values = line.split(',');
        const row = {};
        headers.forEach((header, idx) => {
            if (ALL_COLUMNS.map(toCamelCase).includes(header)) {
                row[header] = values[idx] !== undefined ? values[idx].trim() : '';
            }
        });
        return row;
    });

    return { rows, errors };
}
test('Мой тринадцатый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});
