import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import parseGeoJson from './geoJsonParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFilePath = path.join(__dirname, 'export.geojson');
const outputFilePath = path.join(__dirname, 'parsedData.json');

const saveParsedData = (data, filePath) => {
    const jsonData = JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, jsonData, 'utf-8');
};

const printTableStats = (data) => {
    console.log('Парсинг завершено.');
    console.log('Кількість записів у таблицях:');
    console.log(`CATEGORIES: ${data.CATEGORIES.length}`);
    console.log(`ORGANIZATIONS: ${data.ORGANIZATIONS.length}`);
    console.log(`LOCATIONS: ${data.LOCATIONS.length}`);
    console.log(`ORGANIZATION_CATIGORIES: ${data.ORGANIZATION_CATIGORIES.length}`);
};

const main = () => {
    try {
        const parsedData = parseGeoJson(inputFilePath);

        saveParsedData(parsedData, outputFilePath);
        printTableStats(parsedData);

        console.log(`Результат збережено у файл: ${outputFilePath}`);
    } catch (error) {
        console.error('Помилка під час парсингу GeoJSON:');
        console.error(error.message);
    }
};

main();