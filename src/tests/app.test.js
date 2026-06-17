import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import organizationsRoutes from './routes/organizations.js';
import categoriesRoutes from './routes/categories.js';

const app = express();

// Базові middleware
app.use(cors());
app.use(express.json()); // Для парсингу application/json
app.use(express.urlencoded({ extended: true })); // Для парсингу application/x-www-form-urlencoded

// Підключення роутів
app.use('/api/organizations', organizationsRoutes);
app.use('/api/categories', categoriesRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Catalog API is running" });
});

// Middleware для обробки помилок
// 404 — роут не знайдено
app.use((req, res, next) => {
    res.status(404).json({
        errors: [{ field: 'url', message: `Route ${req.method} ${req.originalUrl} not found` }]
    });
});

// Глобальний обробник серверних помилок (500)
app.use(errorHandler);

export default app;
test('Мой шестнадцатый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});
