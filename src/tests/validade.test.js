import { validationResult } from 'express-validator';

// Універсальний middleware для перевірки результатів express-validator
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Форматуємо помилки відповідно до документації
        const formattedErrors = errors.array().map(err => ({
            field: err.path, // express-validator v7 використовує 'path' замість 'param'
            message: err.msg
        }));

        return res.status(400).json({ errors: formattedErrors });
    }
    next();
};

export default validate;
test('Мой десятый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});