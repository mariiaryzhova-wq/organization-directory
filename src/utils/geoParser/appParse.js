/*
  Цей файл є невеликим додатком для запуску парсера.

  Він:
  1. Викликає функцію parseGeoJson.
  2. Передає їй шлях до GeoJSON-файлу.
  3. Зберігає результат у parsedData.json.
  4. Виводить у консоль кількість записів у кожній "таблиці".
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import parseGeoJson from './geoJsonParser.js';

/*
  В ES Modules немає стандартних змінних __filename та __dirname,
  які зазвичай є в CommonJS.

  Тому ми створюємо їх вручну через import.meta.url.
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
  Шлях до вхідного GeoJSON-файлу.

  Файл export.geojson має лежати в тій самій папці,
  що й цей appParse.js.
*/
const inputFilePath = path.join(__dirname, 'export.geojson');

/*
  Шлях до файлу, у який буде збережений результат парсингу.

  Після запуску додатку з'явиться файл parsedData.json.
*/
const outputFilePath = path.join(__dirname, 'parsedData.json');

/*
  Функція зберігає розпарсені дані у JSON-файл.

  JSON.stringify(data, null, 2) використовується для того,
  щоб файл був красиво відформатований і його було зручно читати.
*/
const saveParsedData = (data, filePath) => {
    const jsonData = JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, jsonData, 'utf-8');
};

/*
  Функція виводить статистику після парсингу.

  Тут ми показуємо кількість записів у кожному масиві,
  який імітує таблицю БД.
*/
const printTableStats = (data) => {
    console.log('Парсинг завершено.');
    console.log('Кількість записів у таблицях:');

    console.log(`CATEGORIES: ${data.CATEGORIES.length}`);
    console.log(`ORGANIZATIONS: ${data.ORGANIZATIONS.length}`);
    console.log(`LOCATIONS: ${data.LOCATIONS.length}`);
    console.log(`ORGANIZATION_CATIGORIES: ${data.ORGANIZATION_CATIGORIES.length}`);
};

/*
  Основна функція додатку.

  У try виконується основна логіка:
  - парсимо GeoJSON;
  - зберігаємо результат;
  - виводимо статистику.

  У catch обробляємо можливі помилки:
  - файл не знайдено;
  - некоректний JSON;
  - помилка всередині парсера.
*/
const main = () => {
    try {
        /*
          Викликаємо парсер і передаємо шлях до GeoJSON-файлу.

          parseGeoJson повертає об'єкт виду:
          {
            CATEGORIES: [],
            ORGANIZATIONS: [],
            LOCATIONS: [],
            ORGANIZATION_CATIGORIES: []
          }
        */
        const parsedData = parseGeoJson(inputFilePath);

        /*
          Зберігаємо результат парсингу у файл parsedData.json.
        */
        saveParsedData(parsedData, outputFilePath);

        /*
          Виводимо кількість записів у кожній "таблиці".
        */
        printTableStats(parsedData);

        /*
          Додатково показуємо шлях, куди був збережений результат.
        */
        console.log(`Результат збережено у файл: ${outputFilePath}`);
    } catch (error) {
        /*
          Якщо щось пішло не так, програма не впаде мовчки,
          а виведе зрозуміле повідомлення про помилку.
        */
        console.error('Помилка під час парсингу GeoJSON:');
        console.error(error.message);
    }
};

/*
  Запускаємо додаток.
*/
main();