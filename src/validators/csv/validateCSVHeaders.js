import {
  REQUIRED_COLUMNS,
  OPTIONAL_COLUMNS,
} from "../../constants/constantsCSVParser.js";

export const validateHeaders = (headers) => {
  // 1. Якщо headers пусті — просто ігноруємо
  if (!headers || headers.length === 0) {
    return false;
  }

  // 2. Нормалізація headers
  const normalizedHeaders = headers
    .map((h) => h.replace(/^\uFEFF/, "").trim())
    .filter(Boolean);

  // 3. Якщо після очистки нічого не лишилось
  if (normalizedHeaders.length === 0) {
    return false;
  }

  // 4. REQUIRED columns check
  for (const column of REQUIRED_COLUMNS) {
    if (!normalizedHeaders.includes(column)) {
      throw new Error(`Missing required column: ${column}`);
    }
  }

  // 5. allowed columns
  const allowedColumns = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];

  // 6. unknown columns warning
  const unknownColumns = normalizedHeaders.filter(
    (h) => !allowedColumns.includes(h),
  );

  if (unknownColumns.length > 0) {
    console.warn("Unknown columns ignored:", unknownColumns);
  }

  return true;
};
