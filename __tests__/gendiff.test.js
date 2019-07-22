import { readFileSync } from 'fs';
import gendiff from '../src/gendiff';

test('test json compare', () => {
  const pathToFile1 = './__tests__/__fixtures__/testPack1/before.json';
  const pathToFile2 = './__tests__/__fixtures__/testPack1/after.json';
  const output = readFileSync(
    './__tests__/__fixtures__/testPack1/output.txt',
    'utf8',
  );
  expect(gendiff(pathToFile1, pathToFile2)).toBe(output);
});
