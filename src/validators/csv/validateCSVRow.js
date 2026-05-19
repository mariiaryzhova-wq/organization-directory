export const validateRow = (row, rowCount, results, errors) => {
  // Нормалізація рядка CSV (trim + приведення пустих значень до null)
  const normalizedRow = {
    name: row.name?.trim(),
    description: row.description?.trim() || null,
    website_url: row.website_url?.trim() || null,
  };

  // Перевірка: чи весь рядок порожній (ігноруємо такі рядки)
  const isEmpty = Object.values(normalizedRow).every((v) => !v);

  if (isEmpty) return null;

  // Перевірка обов'язкового поля name
  if (!normalizedRow.name) {
    errors.push({
      row: rowCount,
      error: "Missing required field: name",
    });
    return null;
  }

  // Перевірка дубліката в межах поточного CSV
  const duplicate = results.find(
    (item) => item.name.toLowerCase() === normalizedRow.name.toLowerCase(),
  );

  if (duplicate) {
    errors.push({
      row: rowCount,
      error: `Duplicate name: ${normalizedRow.name}`,
    });
    return null;
  }

  // всі перевірки пройдені — повертаємо валідований рядок
  return normalizedRow;
};
