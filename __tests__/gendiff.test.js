import { readFileSync } from 'fs';
import path from 'path';
import gendiff from '../src';

/**
 * Описание
 *
 * fileExtension  // расширение сравниваемых файлов
 * outputFormat // выбранный тип форматирования результата выполнения
 *
 * pathToFixtures // путь к тестовым данным текущего теста
 * pathToFile1 // путь к первому сравниваемому файлу
 * pathToFile2 // путь ко второму сравниваемому файлу
 * pathToOutputFile // путь к файлу с резултатом выполнения пакета
 *
 */

const genGetPathForFunc = pathToFixtures => (file) => {
  const [name, ext] = file.split('.');
  switch (name) {
    case 'file1':
    case 'file2':
      return path.join(__dirname, pathToFixtures, 'inputData', ext, `${name}.${ext}`);
    case 'defaultOption':
    case 'plain':
    case 'json':
      return path.join(__dirname, pathToFixtures, 'outputData', `${name}.${ext}`);
    default:
      throw new Error('incorrect file');
  }
};

describe('diff nested structures', () => {
  test.each`
   fileExtension |  outputFormat
    ${'json'}    | ${'defaultOption'}
    ${'ini'}     |    ${'plain'}
    ${'yaml'}    |    ${'json'}
`('gendiff file1.$fileExtension file2.$fileExtension -f $outputFormat ',
  ({ fileExtension, outputFormat }) => {
    const pathToFixtures = '/__fixtures__/nested_structure/';
    const getPathFor = genGetPathForFunc(pathToFixtures);
    const [
      pathToFile1,
      pathToFile2,
      pathToOutputFile,
    ] = [
      getPathFor(`file1.${fileExtension}`),
      getPathFor(`file2.${fileExtension}`),
      getPathFor(`${outputFormat}.txt`),
    ];

    const output = readFileSync(
      pathToOutputFile,
      'utf8',
    );

    const received = gendiff(pathToFile1, pathToFile2, outputFormat);
    const expected = output;
    expect(received).toBe(expected);
  });
});
