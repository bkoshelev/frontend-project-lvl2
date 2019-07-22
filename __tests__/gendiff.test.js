import { readFileSync } from 'fs';
import path from 'path';
import gendiff from '../src/gendiff';

test('test json compare', () => {
  const pathToFixtures = '/__fixtures__/testPack1/';
  const pathToFile1 = path.join(__dirname, pathToFixtures, 'before.json');
  const pathToFile2 = path.join(__dirname, pathToFixtures, 'after.json');
  const output = readFileSync(
    path.join(__dirname, pathToFixtures, 'output.txt'),
    'utf8',
  );
  expect(gendiff(pathToFile1, pathToFile2)).toBe(output);
});
