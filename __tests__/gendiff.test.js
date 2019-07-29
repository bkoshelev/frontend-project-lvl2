import { readFileSync } from 'fs';
import path from 'path';
import gendiff from '../src';
import { outputFormatOptionPossibleValues } from '../src/formatters';

const { defaultOption, plain, json } = outputFormatOptionPossibleValues;
describe('nested structure', () => {
  test.each`
    testPackNumber | fileExtension |    outputFormat
        ${1}       |   ${'json'}   |    ${undefined}
        ${1}       |   ${'json'}   |    ${defaultOption}
        ${2}       |   ${'yaml'}   |    ${plain}
        ${3}       |   ${'ini'}    |    ${json}
  `('test $fileExtension file extension / nested structure / $outputFormat output format',
  ({ testPackNumber, fileExtension, outputFormat }) => {
    const pathToFixtures = `/__fixtures__/testPack${testPackNumber}/`;

    const pathToFile1 = path.join(__dirname, pathToFixtures, `file1.${fileExtension}`);
    const pathToFile2 = path.join(__dirname, pathToFixtures, `file2.${fileExtension}`);
    const outputFileContent = readFileSync(
      path.join(__dirname, pathToFixtures, 'output.txt'),
      'utf8',
    );
    expect(gendiff(pathToFile1, pathToFile2, outputFormat)).toBe(outputFileContent);
  });
});

test('test json file extension / empty file', () => {
  const pathToFixtures = '/__fixtures__/testPack4/';
  const pathToFile1 = path.join(__dirname, pathToFixtures, 'file1.json');
  const pathToFile2 = path.join(__dirname, pathToFixtures, 'file2.json');
  expect(() => gendiff(pathToFile1, pathToFile2)).toThrow('invalid JSON file content');
});

describe('empty object', () => {
  test.each`
    testPackNumber |  outputFormat
        ${5}       |  ${defaultOption}
        ${6}       |  ${plain}
        ${7}       |  ${json}
  `('test $fileExtension file extension / empty object / $outputFormat output format',
  ({ testPackNumber, outputFormat }) => {
    const pathToFixtures = `/__fixtures__/testPack${testPackNumber}/`;
    const pathToFile1 = path.join(__dirname, pathToFixtures, 'file1.json');
    const pathToFile2 = path.join(__dirname, pathToFixtures, 'file2.json');
    const outputFileContent = readFileSync(
      path.join(__dirname, pathToFixtures, 'output.txt'),
      'utf8',
    );
    expect(gendiff(pathToFile1, pathToFile2, outputFormat)).toBe(outputFileContent);
  });
});
