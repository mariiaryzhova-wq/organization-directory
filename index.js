import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import errorHandler from './src/middleware/errorHandler.js';
import moderationRoutes from './src/routes/moderationRoutes.js';
import organizationsRoutes from './src/routes/organizations.js';
import categoriesRoutes from './src/routes/categories.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Базові middleware
app.use(cors());
app.use(express.json()); // Для парсингу application/json
app.use(express.urlencoded({ extended: true })); // Для парсингу application/x-www-form-urlencoded

// Підключення роутів
app.use('/api/organizations', organizationsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/moderation', moderationRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Catalog API is running" });
});

// Middleware для обробки помилок
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
