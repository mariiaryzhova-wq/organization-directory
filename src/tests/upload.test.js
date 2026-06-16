import multer from 'multer';

// Налаштування збереження файлів у пам'яті (memory storage)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 8 * 1024 * 1024 // Ліміт 8MB
  },
  fileFilter: (req, file, cb) => {
    // Дозволяємо тільки CSV файли
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

export default upload;
test('Мой девятый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});