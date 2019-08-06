import { readFileSync } from 'fs';
import path from 'path';
import gendiff from '../src';

const getPathFor = (file) => {
  const [name, ext] = file.split('.');
  switch (name) {
    case 'file1':
    case 'file2':
      return path.join(__dirname, '/__fixtures__/', 'inputData', ext, `${name}.${ext}`);
    case 'defaultOption':
    case 'plain':
    case 'json':
      return path.join(__dirname, '/__fixtures__/', 'outputData', `${name}.${ext}`);
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
    const pathToFile1 = getPathFor(`file1.${fileExtension}`);
    const pathToFile2 = getPathFor(`file2.${fileExtension}`);
    const pathToOutputFile = getPathFor(`${outputFormat}.txt`);

    const output = readFileSync(
      pathToOutputFile,
      'utf8',
    );

    const received = gendiff(pathToFile1, pathToFile2, outputFormat);
    const expected = output;
    expect(received).toBe(expected);
  });
});
