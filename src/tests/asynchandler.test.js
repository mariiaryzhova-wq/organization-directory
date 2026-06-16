// Обгортка для асинхронних функцій, щоб не використовувати try-catch у кожному контролері
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
test('Мой первый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});