import { readFileSync } from 'fs';
import { has } from 'lodash/fp';
import { resolve } from 'path';

const gendiff = (pathToFile1, pathToFile2) => {
  const file1Content = readFileSync(resolve(pathToFile1));
  const file2Content = readFileSync(resolve(pathToFile2));

  const beforeJson = JSON.parse(file1Content);
  const afterJson = JSON.parse(file2Content);

  const keys = [...Object.keys(beforeJson), ...Object.keys(afterJson)].reduce(
    (acc, key) => (acc.includes(key) ? acc : [...acc, key]),
    [],
  );

  const outputJson = keys.reduce((acc, key) => {
    if (has(key, afterJson)) {
      if (has(key, beforeJson)) {
        if (afterJson[key] === beforeJson[key]) {
          acc[`  ${key}`] = beforeJson[key];
        } else {
          acc[`- ${key}`] = beforeJson[key];
          acc[`+ ${key}`] = afterJson[key];
        }
      } else {
        acc[`+ ${key}`] = afterJson[key];
      }
    } else {
      acc[`- ${key}`] = beforeJson[key];
    }
    return acc;
  }, {});

  const outputValuesToString = Object.entries(outputJson)
    .map(([key, value]) => `  ${key}: ${value}\n`)
    .join('');

  const outputJsonToString = `{\n${outputValuesToString}}`;
  return outputJsonToString;
};

export default gendiff;
