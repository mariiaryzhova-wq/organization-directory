import { parseCSV } from "./csvParser.js";

// Масив тестових CSV файлів
const testFiles = [
  "./src/utils/duplicated.csv",
  "./src/utils/empty-lines-garbage.csv",
  "./src/utils/large-file.csv",
  "./src/utils/test-html-garbage.csv",
  "./src/utils/test-cyrillic-emoji.csv",
  "./src/utils/test-zero.csv",
  "./src/utils/without-col-description.csv",
  "./src/utils/without-name.csv",
];

// Асинхронна функція запуску тестів
const runTests = async () => {
  for (const file of testFiles) {
    console.log("\n=================================");
    console.log(`TEST FILE: ${file}`);
    console.log("=================================");

    try {
      const result = await parseCSV(file);

      console.log("RESULT:");
      console.dir(result, { depth: null });
    } catch (error) {
      console.error("ERROR:");
      console.error(error.message);
    }
  }
};

// Запуск тестів
runTests();
