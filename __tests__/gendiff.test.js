import gendiff from '../src/gendiff';

test('test json compare', () => {
  const pathToFile1 = './__tests__/testPack1/before.json';
  const pathToFile2 = './__tests__/testPack1/after.json';

  const result = `{
    host: hexlet.io
  - timeout: 50
  + timeout: 20
  - proxy: 123.234.53.22
  - follow: false
  + verbose: true
}`;
  expect(gendiff(pathToFile1, pathToFile2)).toBe(result);
});
