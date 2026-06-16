// Глобальний обробник помилок, який форматує відповідь згідно з документацією
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        errors: [{
            field: err.field || 'server',
            message: message
        }]
    });
};

export default errorHandler;
test('Мой пятый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});