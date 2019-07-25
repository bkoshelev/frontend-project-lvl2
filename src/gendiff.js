import { readFileSync } from 'fs';
import { has, isObject, uniq } from 'lodash/fp';
import sortBy from 'lodash/fp/sortBy';
import { resolve, basename } from 'path';

import parseFileContentsToObject from './parsers';
import generateOutputText from './formatters';

const readFiles = filePaths => filePaths.map(filePath => ({
  fileName: basename(filePath),
  fileContent: readFileSync(resolve(filePath), 'utf8'),
}));

const generateStructureDiffBetweenFiles = ([file1ContentObject, file2ContentObject]) => {
  const identifyNodeType = (currentComparedObj1, currentcomparedObj2, currentObjPropKey) => {
    const types = [
      {
        typeName: 'removed',
        typeCondition: (obj1, obj2, objPropKey) => has(objPropKey, obj1) && !has(objPropKey, obj2),
      },
      {
        typeName: 'added',
        typeCondition: (obj1, obj2, objPropKey) => !has(objPropKey, obj1) && has(objPropKey, obj2),
      },
      {
        typeName: 'unchanged',
        typeCondition: (obj1, obj2, objPropKey) => (obj1[objPropKey] === obj2[objPropKey]) || (isObject(obj1[objPropKey]) && isObject(obj2[objPropKey])),
      },
      {
        typeName: 'changed',
        typeCondition: (obj1, obj2, objPropKey) => obj1[objPropKey] !== obj2[objPropKey],
      },
    ];
    const passTypeIndex = types.findIndex(({ typeCondition }) => typeCondition(currentComparedObj1, currentcomparedObj2, currentObjPropKey));
    return types[passTypeIndex].typeName;
  };

  const generateStructureDiffBetweenObjects = (comparedObj1, comparedObj2) => {
    const allKeysInObjects = [...Object.keys(comparedObj1), ...Object.keys(comparedObj2)]
      |> uniq
      |> sortBy(key => key);

    const structure = allKeysInObjects.map((currentObjPropKey) => {
      const newNode = {
        nodeType: identifyNodeType(comparedObj1, comparedObj2, currentObjPropKey),
        propKey: currentObjPropKey,
        value1: comparedObj1[currentObjPropKey],
        value2: comparedObj2[currentObjPropKey],
        children: isObject(comparedObj1[currentObjPropKey]) && isObject(comparedObj2[currentObjPropKey])
          ? generateStructureDiffBetweenObjects(comparedObj1[currentObjPropKey], comparedObj2[currentObjPropKey]) : [],
      };
      return newNode;
    });
    return structure;
  };
  return generateStructureDiffBetweenObjects(file1ContentObject, file2ContentObject);
};

const gendiff = (pathToFile1, pathToFile2, outputFormatOption = 'default') => {
  const outputText = [pathToFile1, pathToFile2]
    |> readFiles
    |> parseFileContentsToObject
    |> generateStructureDiffBetweenFiles
    |> generateOutputText(outputFormatOption);
  return outputText;
};

export default gendiff;
export { generateStructureDiffBetweenFiles };
