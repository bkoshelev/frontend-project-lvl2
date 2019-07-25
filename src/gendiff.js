import { readFileSync } from 'fs';
import { has, isObject, uniq } from 'lodash/fp';
import sortBy from 'lodash/fp/sortBy';
import { resolve, basename } from 'path';

import parseFilesContent from './parsers';
import generateOutput from './formatters';

const readFiles = paths => paths.map(path => ({
  name: basename(path),
  content: readFileSync(resolve(path), 'utf8'),
}));

const generateAstDiff = ([beforeObj, afterObj], level = 1) => {
  const keys = [...Object.keys(beforeObj), ...Object.keys(afterObj)]
    |> uniq
    |> sortBy(el => el);

  const ast = keys.reduce((acc, key) => {
    const newAcc = [...acc];
    if (isObject(beforeObj[key]) && isObject(afterObj[key])) {
      newAcc.push({
        type: 'list',
        key,
        value: generateAstDiff([beforeObj[key], afterObj[key]], level + 1),
      });
    } else if (has(key, beforeObj) && !has(key, afterObj)) {
      newAcc.push({
        type: 'removed',
        key,
        oldValue: beforeObj[key],
      });
    } else if (!has(key, beforeObj) && has(key, afterObj)) {
      newAcc.push({
        type: 'added',
        key,
        newValue: afterObj[key],
      });
    } else if (beforeObj[key] === afterObj[key]) {
      newAcc.push({
        type: 'equal',
        key,
        value: beforeObj[key],
      });
    } else if (beforeObj[key] !== afterObj[key]) {
      newAcc.push({
        type: 'changed',
        key,
        oldValue: beforeObj[key],
        newValue: afterObj[key],
      });
    }

    return newAcc;
  }, []);
  return ast;
};

const gendiff = (pathToFile1, pathToFile2, format = 'default') => {
  const diffOutput = [pathToFile1, pathToFile2]
    |> readFiles
    |> parseFilesContent
    |> generateAstDiff
    |> generateOutput(format);
  return diffOutput;
};

export default gendiff;
export { generateAstDiff };
