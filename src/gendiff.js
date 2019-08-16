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

const generateNodeByType = (nodeType, value1, value2, propKey, children) => ({
  nodeType,
  propKey,
  value1,
  value2,
  children,
});

const generateNode = (obj1, obj2, propKey) => {
  if (has(propKey, obj1) && !has(propKey, obj2)) {
    return generateNodeByType('removed', obj1[propKey], null, propKey, []);
  }
  if (!has(propKey, obj1) && has(propKey, obj2)) {
    return generateNodeByType('added', null, obj2[propKey], propKey, []);
  }
  if (isObject(obj1[propKey]) && isObject(obj2[propKey])) {
    const children = generateTreeDiffBetweenObjects(obj1[propKey], obj2[propKey]);
    return generateNodeByType('nested', obj1[propKey], obj2[propKey], propKey, children);
  }
  if (obj1[propKey] === obj2[propKey]) {
    return generateNodeByType('unchanged', obj1[propKey], obj2[propKey], propKey, []);
  }
  if (obj1[propKey] !== obj2[propKey]) {
    return generateNodeByType('changed', obj1[propKey], obj2[propKey], propKey, []);
  }
  throw new Error('genTreeDiff: unknown node type');
};

const generateTreeDiffBetweenObjects = (comparedObj1, comparedObj2) => {
  const allKeysInObjects = union(keys(comparedObj1), keys(comparedObj2))
    |> sortBy(key => key);

  const tree = allKeysInObjects.map((currentObjPropKey) => {
    const newNode = generateNode(comparedObj1, comparedObj2, currentObjPropKey);
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
