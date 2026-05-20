// формат: .CSV, кодування UTF-8, макс розмір: 8MB
export const MAX_FILE_SIZE = 8 * 1024 * 1024; // 1024 bytes = 1 KB, 1024 KB = 1 MB
export const MAX_ROWS = 500; // в одному імпорті
// визначаємо структуру документу
export const REQUIRED_COLUMNS = ["name"];
export const OPTIONAL_COLUMNS = ["description", "website_url"];
