import fs from "fs";
import path from "path";
import { MAX_FILE_SIZE } from "../../constants/constantsCSVParser";

export const validateFile = (filePath) => {
  // Перевірка існування файлу
  if (!fs.existsSync(filePath)) {
    throw new Error("File not found");
  }
  // Перевірка розширення файла
  const ext = path.extname(filePath).toLowerCase();
  if (ext !== ".csv") {
    throw new Error("Only CSV files are allowed");
  }
  // Отримання метаданих файлу (розмір, дата, тощо)
  const stats = fs.statSync(filePath);
  // Перевірка розміру файла(якщо перевищення ліміту байтів - помилка)
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 8MB");
  }
};
