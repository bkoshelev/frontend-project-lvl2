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


const generateTreeDiffBetweenObjects = (comparedObj1, comparedObj2) => {
  const generateNodeByType = (obj1, obj2, propKey) => {
    const generateNode = (nodeType, value1, value2, children) => ({
      nodeType,
      meta: {
        propKey,
        value1,
        value2,
      },
      children,
    });

    if (has(propKey, obj1) && !has(propKey, obj2)) return generateNode('removed', obj1[propKey], null, []);
    if (!has(propKey, obj1) && has(propKey, obj2)) return generateNode('added', null, obj2[propKey], []);
    if (isObject(obj1[propKey]) && isObject(obj2[propKey])) {
      const children = generateTreeDiffBetweenObjects(obj1[propKey], obj2[propKey]);
      return generateNode('nested', obj1[propKey], obj2[propKey], children);
    }
    if (obj1[propKey] === obj2[propKey]) return generateNode('unchanged', obj1[propKey], obj2[propKey], []);
    if (obj1[propKey] !== obj2[propKey]) return generateNode('changed', obj1[propKey], obj2[propKey], []);
    throw new Error('genTreeDiff: unknown node type');
  };
  const allKeysInObjects = union(keys(comparedObj1), keys(comparedObj2))
    |> sortBy(key => key);

  const tree = allKeysInObjects.map((currentObjPropKey) => {
    const newNode = generateNodeByType(comparedObj1, comparedObj2, currentObjPropKey);
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
