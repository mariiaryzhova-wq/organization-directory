import fs from "fs";
import csv from "csv-parser";
import iconv from "iconv-lite";

import { MAX_ROWS } from "../constants/constantsCSVParser.js";

import { validateFile } from "../validators/csv/validateCSVFile.js";
import { validateHeaders } from "../validators/csv/validateCSVHeaders.js";
import { validateRow } from "../validators/csv/validateCSVRow.js";

// Головна функція парсингу CSV
// Приймає шлях до файлу
export const parseCSV = (filePath) => {
  // Promise потрібен, бо стріми працюють асинхронно
  return new Promise((resolve, reject) => {
    // Масив валідних рядків
    const results = [];

    // Масив помилок парсингу/валідації
    const errors = [];

    // Лічильник рядків CSV
    let rowCount = 0;

    // Прапорець перевірки headers
    // Щоб headers валідовувались тільки 1 раз
    let headersChecked = false;

    // 1. Перевірка файлу ДО запуску стріму
    try {
      validateFile(filePath);
    } catch (err) {
      return reject(err);
    }

    // 2. Створення stream читання файлу
    fs.createReadStream(filePath)

      // 3. Декодування UTF-8
      .pipe(iconv.decodeStream("utf-8"))

      // 4. Передача потоку в csv-parser
      .pipe(csv())

      // 5. Обробка кожного рядка CSV
      .on("data", (row) => {
        // 6. Headers перевіряємо лише 1 раз
        if (!headersChecked) {
          const headers = Object.keys(row).map((h) =>
            h.replace(/^\uFEFF/, "").trim(),
          );

          console.log("DETECTED HEADERS:", headers);

          try {
            validateHeaders(headers);
          } catch (err) {
            return reject(err);
          }

          // 🔥 ВАЖЛИВО: ставимо після успішної перевірки
          headersChecked = true;
        }

        // 7. Збільшуємо лічильник рядків
        rowCount++;

        // 8. Захист від дуже великих CSV
        if (rowCount > MAX_ROWS) {
          return;
        }

        // 9. Валідація та нормалізація рядка
        const validRow = validateRow(row, rowCount, results, errors);

        // 10. Якщо рядок валідний — додаємо у results
        if (validRow) {
          results.push(validRow);
        }
      })

      // 11. Завершення stream parsing
      .on("end", () => {
        resolve({
          data: results,
          errors,
        });
      })

      // 12. Глобальні помилки stream
      .on("error", reject);
  });
};
