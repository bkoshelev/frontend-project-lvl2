import { readFileSync, existsSync } from 'fs';
import { extname, resolve } from 'path';

import {
  has, isObject, keys, union,
} from 'lodash/fp';
import sortBy from 'lodash/fp/sortBy';

import parseFileContent from './parsers';
import genOutputText from './formatters';

const readFile = (filePath) => {
  if (!existsSync(filePath)) {
    throw Error(`file ${filePath} not exist`);
  }
  return readFileSync(resolve(filePath), 'utf8');
};

const identifyNodeType = (obj1, obj2, propKey) => {
  if (has(propKey, obj1) && !has(propKey, obj2)) return 'removed';
  if (!has(propKey, obj1) && has(propKey, obj2)) return 'added';
  if (obj1[propKey] === obj2[propKey]) return 'unchanged';
  if (obj1[propKey] !== obj2[propKey]) return 'changed';
  throw new Error('genTreeDiff: unknown node type');
};

const generateTreeDiffBetweenObjects = (comparedObj1, comparedObj2) => {
  const allKeysInObjects = union(keys(comparedObj1), keys(comparedObj2))
    |> sortBy(key => key);

  const tree = allKeysInObjects.map((currentObjPropKey) => {
    const nodeType = identifyNodeType(comparedObj1, comparedObj2, currentObjPropKey);

    const obj1PropValue = comparedObj1[currentObjPropKey];
    const obj2PropValue = comparedObj2[currentObjPropKey];

    const newNode = {
      nodeType,
      propKey: currentObjPropKey,
      value1: obj1PropValue,
      value2: obj2PropValue,
      children: isObject(obj1PropValue) && isObject(obj2PropValue)
        ? generateTreeDiffBetweenObjects(obj1PropValue, obj2PropValue) : [],
    };
    return newNode;
  });
  return tree;
};

const gendiff = (pathToFile1, pathToFile2, outputFormatOption) => {
  const obj1 = parseFileContent(extname(pathToFile1), readFile(pathToFile1));
  const obj2 = parseFileContent(extname(pathToFile2), readFile(pathToFile2));

  const outputText = generateTreeDiffBetweenObjects(obj1, obj2)
    |> (_ => genOutputText(_, outputFormatOption));
  return outputText;
};


export default gendiff;
