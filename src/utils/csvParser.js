import fs from "fs";
import csv from "csv-parser";
import { MAX_ROWS, REQUIRED_COLUMNS } from "../constants/constantsCSVParser.js";
import { validateFile } from "../validators/csv/validateCSVFile.js";
import { validateRow } from "../validators/csv/validateRow.js";

export const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const errors = [];
    let rowCount = 0;

    try {
      validateFile(filePath);
    } catch (err) {
      return reject(err);
    }
    // Створення потоку читання CSV файлу у UTF-8 (streaming обробка без завантаження всього файлу в пам'ять)
    fs.createReadStream(filePath, { encoding: "utf8" })
      // Передача потоку в csv parser
      .pipe(csv())
      // Перевірка заголовків CSV (чи містить всі обов'язкові колонки)
      .on("headers", (headers) => {
        // Видалення зайвих пробілів у назвах колонок
        const normalized = headers.map((h) => h.trim());
        // Перевірка наявності обов'язкових колонок
        for (const col of REQUIRED_COLUMNS) {
          if (!normalized.includes(col)) {
            return reject(new Error(`Missing column: ${col}`));
          }
        }
      })
      // поки є новий рядок CSV, виконується цю функцію(конвеєр)
      .on("data", (row) => {
        rowCount++;
        // Обмеження кількості рядків для імпорту (захист від великих файлів)
        if (rowCount > MAX_ROWS) return;
        // Валідація та нормалізація рядка (перевірка дубліката, пустих значень тощо)
        const validRow = validateRow(row, rowCount, results, errors);

        if (validRow) {
          results.push(validRow);
        }
      })
      // Завершення обробки CSV
      .on("end", () => {
        resolve({ data: results, errors });
      })
      // Обробка помилок читання файлу
      .on("error", reject);
  });
};
