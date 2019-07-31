import { readFileSync, existsSync } from 'fs';


import { has, isObject, uniq } from 'lodash/fp';
import sortBy from 'lodash/fp/sortBy';
import { resolve, basename } from 'path';

import parseFileContentsToObject from './parsers';
import generateOutputText from './formatters';

const readFiles = filePaths => filePaths.map((filePath) => {
  if (!existsSync(filePath)) {
    throw Error(`file ${filePath} not exist`);
  }
  return {
    fileName: basename(filePath),
    fileContent: readFileSync(resolve(filePath), 'utf8'),
  };
});

const generateStructureDiffBetweenFiles = ([file1ContentObject, file2ContentObject]) => {
  const identifyNodeType = (comparedObj1, comparedObj2, objPropKey) => {
    const types = [
      {
        typeName: 'removed',
        typeCondition: (obj1, obj2, propKey) => has(propKey, obj1) && !has(propKey, obj2),
      },
      {
        typeName: 'added',
        typeCondition: (obj1, obj2, propKey) => !has(propKey, obj1) && has(propKey, obj2),
      },
      {
        typeName: 'nodeList',
        typeCondition: (obj1, obj2, propKey) => {
          const isCondTrue = isObject(obj1[propKey]) && isObject(obj2[propKey]);
          return isCondTrue;
        },
      },
      {
        typeName: 'unchanged',
        typeCondition: (obj1, obj2, propKey) => (obj1[propKey] === obj2[propKey]),
      },
      {
        typeName: 'changed',
        typeCondition: (obj1, obj2, propKey) => obj1[propKey] !== obj2[propKey],
      },
    ];

    const passTypeIndex = types.findIndex(({ typeCondition }) => {
      const isConditionTrue = typeCondition(comparedObj1, comparedObj2, objPropKey);
      return isConditionTrue;
    });

    return types[passTypeIndex].typeName;
  };

  const generateStructDiffBetweenObjects = (comparedObj1, comparedObj2) => {
    const allKeysInObjects = [...Object.keys(comparedObj1), ...Object.keys(comparedObj2)]
      |> uniq
      |> sortBy(key => key);

    const structure = allKeysInObjects.map((currentObjPropKey) => {
      const obj1PropValue = comparedObj1[currentObjPropKey];
      const obj2PropValue = comparedObj2[currentObjPropKey];

      const nodeType = identifyNodeType(comparedObj1, comparedObj2, currentObjPropKey);

      const newNode = {
        nodeType,
        propKey: currentObjPropKey,
        value1: obj1PropValue,
        value2: obj2PropValue,
        children: nodeType === 'nodeList'
          ? generateStructDiffBetweenObjects(obj1PropValue, obj2PropValue) : [],
      };
      return newNode;
    });
    return structure;
  };

  return generateStructDiffBetweenObjects(file1ContentObject, file2ContentObject);
};

const gendiff = (pathToFile1, pathToFile2, outputFormatOption) => {
  const outputText = [pathToFile1, pathToFile2]
    |> readFiles
    |> parseFileContentsToObject
    |> generateStructureDiffBetweenFiles
    |> generateOutputText(outputFormatOption);
  return outputText;
};

export default gendiff;
