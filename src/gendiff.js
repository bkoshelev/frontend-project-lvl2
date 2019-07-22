import { readFileSync } from 'fs';
import { has } from 'lodash/fp';
import { resolve } from 'path';

const readFiles = ([pathToFile1, pathToFile2]) => [
  readFileSync(resolve(pathToFile1)),
  readFileSync(resolve(pathToFile2)),
];

const parseFilesContent = ([file1Content, file2Content]) => [
  JSON.parse(file1Content),
  JSON.parse(file2Content),
];

const generateDiffOutput = ([beforeJson, afterJson]) => {
  const keys = [...Object.keys(beforeJson), ...Object.keys(afterJson)].reduce(
    (acc, key) => (acc.includes(key) ? acc : [...acc, key]),
    [],
  );

  const outputJson = keys.reduce((acc, key) => {
    const newAcc = [...acc];
    if (has(key, afterJson)) {
      if (has(key, beforeJson)) {
        if (afterJson[key] === beforeJson[key]) {
          newAcc.push(`    ${key}: ${beforeJson[key]}\n`);
        } else {
          newAcc.push(`  - ${key}: ${beforeJson[key]}\n`);
          newAcc.push(`  + ${key}: ${afterJson[key]}\n`);
        }
      } else {
        newAcc.push(`  + ${key}: ${afterJson[key]}\n`);
      }
    } else {
      newAcc.push(`  - ${key}: ${beforeJson[key]}\n`);
    }
    return newAcc;
  }, []);
  const output = ['{\n', ...outputJson, '}'].join('');
  return output;
};

const gendiff = (pathToFile1, pathToFile2) => {
  const diffOutput =    [pathToFile1, pathToFile2]
    |> readFiles
    |> parseFilesContent
    |> generateDiffOutput;
  return diffOutput;
};

export default gendiff;
