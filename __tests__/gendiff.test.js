import { readFileSync } from 'fs';
import path from 'path';
import gendiff from '../src';

test.each`
  testPackNumber | fileExtension |    outputFormat
  ${1}       |   ${'json'}   |    ${undefined}
  ${1}       |   ${'json'}   |    ${'default'}
  ${2}       |   ${'yaml'}   |    ${'plain'}
  ${3}       |   ${'ini'}    |    ${'json'}
`('test $fileExtension file extension/nested structure/$outputFormat output format',
  ({ testPackNumber, fileExtension, outputFormat }) => {
    const pathToFixtures = `/__fixtures__/testPack${testPackNumber}/`;

    const pathToFile1 = path.join(__dirname, pathToFixtures, `file1.${fileExtension}`);
    const pathToFile2 = path.join(__dirname, pathToFixtures, `file2.${fileExtension}`);
    const pathToOutputFile = readFileSync(
      path.join(__dirname, pathToFixtures, 'output.txt'),
      'utf8',
    );
    expect(gendiff(pathToFile1, pathToFile2, outputFormat)).toBe(pathToOutputFile);
  });
