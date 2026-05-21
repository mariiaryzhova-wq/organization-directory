export const validateRow = (row, rowCount, results, errors) => {
  // 0. Перевіряємо чи рядок взагалі містить якісь дані
  // Ігноруємо:
  // - пусті рядки
  // - рядки типу: ","
  // - рядки типу: ",,"
  const hasRealData = Object.values(row).some((value) => value?.trim());

  // Якщо даних немає — пропускаємо рядок
  if (!hasRealData) {
    return null;
  }

  // 1. Очищення та нормалізація даних
  // trim() прибирає зайві пробіли:
  // "  Tech Corp  " → "Tech Corp"
  //
  // Якщо поля немає — записуємо null
  const normalizedRow = {
    name: row.name?.trim() || null,

    description: row.description?.trim() || null,

    website_url: row.website_url?.trim() || null,
  };

  // 2. Додаткова перевірка:
  // чи не став рядок повністю порожнім після очистки
  const isEmpty = Object.values(normalizedRow).every(
    (value) => value === null || value === "",
  );

  // Якщо всі поля пусті — ігноруємо рядок
  if (isEmpty) {
    return null;
  }

  // 3. Перевірка обов'язкового поля name
  // Для MVP назва організації обов'язкова
  if (!normalizedRow.name) {
    errors.push({
      row: rowCount,
      error: "Missing required field: name",
    });

    return null;
  }

  // 4. Перевірка зламаної структури CSV
  //
  // Якщо у name випадково потрапив URL:
  // https://site.com
  //
  // це означає:
  // - пропущена кома
  // - зсунулися колонки
  // - CSV пошкоджений
  const isUrl = /^https?:\/\//i.test(normalizedRow.name);

  if (isUrl) {
    errors.push({
      row: rowCount,
      error: "Invalid row structure: name looks like URL",
    });

    return null;
  }

  // 5. Перевірка дублікатів у межах CSV
  //
  // Не дозволяємо дві організації
  // з однаковою назвою
  const duplicate = results.find(
    (item) =>
      item.name && item.name.toLowerCase() === normalizedRow.name.toLowerCase(),
  );

  // Якщо дублікат знайдено —
  // записуємо помилку
  if (duplicate) {
    errors.push({
      row: rowCount,
      error: `Duplicate name: ${normalizedRow.name}`,
    });

    return null;
  }

  // 6. Якщо всі перевірки пройдені —
  // повертаємо валідний рядок
  return normalizedRow;
};
