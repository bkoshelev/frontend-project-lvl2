import { readFileSync } from 'fs';
import path from 'path';
import gendiff from '../src';

/**
 * Описание
 *
 * testName // Название теста
 * fileExtension // расширение сравниваемых файлов
 * outputFormat // выбранный тип форматирования результата выполнения
 * fixtureFolder // название папки с тестовыми данными
 *
 * pathToFixtures // путь к тестовым данным текущего теста
 * pathToFile1 // путь к первому сравниваемому файлу
 * pathToFile2 // путь ко второму сравниваемому файлу
 * pathToOutputFile // путь к файлу с резултатом выполнения пакета
 *
 */

test.each([
  ['diff nested structures', 'json', 'json', 'defaultOption', 'nested_structure'],
  ['nested structure', 'ini', 'ini', 'plain', 'nested_structure'],
  ['nested structure', 'yaml', 'yaml', 'json', 'nested_structure'],
  ['nested structure', 'yaml', 'yaml', 'json', 'nested_structure'],
])('%#. test %s: diff <file1.%s , file2.%s> -f %s ',
  (testName, file1Extension, file2Extension, outputFormat, fixtureFolder) => {
    const pathToFixtures = `/__fixtures__/${fixtureFolder}/`;
    const pathToFile1 = path.join(__dirname, pathToFixtures, 'inputData', file1Extension, `file1.${file1Extension}`);
    const pathToFile2 = path.join(__dirname, pathToFixtures, 'inputData', file2Extension, `file2.${file2Extension}`);
    const pathToOutputFile = path.join(__dirname, pathToFixtures, 'outputData', `${outputFormat}.txt`);

    const output = readFileSync(
      pathToOutputFile,
      'utf8',
    );

    const received = gendiff(pathToFile1, pathToFile2, outputFormat);
    const expected = output;
    expect(received).toBe(expected);
  });
