import 'dotenv/config';
import app from './src/app.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`);
});
test('Мой семнадцатый проверочный тест', () => {
  expect(1 + 1).toBe(2);
});
