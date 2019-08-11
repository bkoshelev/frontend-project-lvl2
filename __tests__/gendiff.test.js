import { readFileSync } from 'fs';
import path from 'path';
import gendiff from '../src';

const pathToFixtures = path.join(__dirname, '/__fixtures__/');

describe('diff nested structures', () => {
  test.each`
   fileExtension |  outputFormat
    ${'json'}    |    ${'pretty'}
    ${'ini'}     |    ${'plain'}
    ${'yaml'}    |    ${'json'}
`('gendiff file1.$fileExtension file2.$fileExtension -f $outputFormat ',
  ({ fileExtension, outputFormat }) => {
    const pathToFile1 = path.join(pathToFixtures, 'inputData', fileExtension, `file1.${fileExtension}`);
    const pathToFile2 = path.join(pathToFixtures, 'inputData', fileExtension, `file2.${fileExtension}`);
    const pathToOutputFile = path.join(pathToFixtures, 'outputData', `${outputFormat}.txt`);

    const output = readFileSync(
      pathToOutputFile,
      'utf8',
    );

    const received = gendiff(pathToFile1, pathToFile2, outputFormat);
    const expected = output;
    expect(received).toBe(expected);
  });
});
