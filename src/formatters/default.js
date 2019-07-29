import { isObject, trim } from 'lodash/fp';

const convertObjectToObjectStyleText = (obj, depthLevel) => {
  const closeBrace = `${' '.repeat(depthLevel * 4)}}`;
  const openBrace = '{';
  const propsText = Object.entries(obj).map(([key, value]) => {
    const propText = `${' '.repeat(depthLevel * 4 + 4)}${key}: ${value}`;
    return propText;
  });
  const objectStyleText = [openBrace, ...propsText, closeBrace].join('\n');
  return objectStyleText;
};

const propValueToString = (value, depthLevel) => {
  if (isObject(value)) return convertObjectToObjectStyleText(value, depthLevel + 1);
  return value;
};
const propKeyToSting = (key, level, tab, delimiter = '') => `${' '.repeat(level * 4 + tab)}${delimiter}${key}: `;

const keyOutputByNodeTypeList = {
  unchanged: (propKey, level) => propKeyToSting(propKey, level, 4),
  added: (propKey, level) => propKeyToSting(propKey, level, 2, '+ '),
  removed: (propKey, level) => propKeyToSting(propKey, level, 2, '- '),
};
const propKeyToStingByNodeType = nodeType => keyOutputByNodeTypeList[nodeType];

const generateDefaultFormatOutputText = (structure) => {
  const convertNodesToObjectStyleText = (nodes, depthLevel = 0) => {
    const outputPropByTypeList = {
      unchanged: (node, level) => propKeyToStingByNodeType('unchanged')(node.propKey, level) + propValueToString(node.value1, level),
      added: (node, level) => propKeyToStingByNodeType('added')(node.propKey, level) + propValueToString(node.value2, level),
      removed: (node, level) => propKeyToStingByNodeType('removed')(node.propKey, level) + propValueToString(node.value1, level),
      changed: (node, level) => `${outputPropByTypeList.removed(node, level)}\n${outputPropByTypeList.added(node, level)}`,
      nodeList: (node, level) => {
        const propKeyToString = keyOutputByNodeTypeList.unchanged(node.propKey, level);
        const valueKeyToString = convertNodesToObjectStyleText(node.children, level + 1);
        return propKeyToString + valueKeyToString;
      },
    };

    const closeBrace = `${' '.repeat(depthLevel * 4)}}`;
    const openBrace = '{';

    if (nodes.length === 0) return openBrace + closeBrace;

    const propsText = nodes.map((node) => {
      const propText = outputPropByTypeList[node.nodeType](node, depthLevel);
      return propText;
    });

    const objectStyleText = [openBrace, ...propsText, closeBrace].join('\n');
    return objectStyleText;
  };

  const outputText = convertNodesToObjectStyleText(structure);
  return trim(outputText);
};

export default generateDefaultFormatOutputText;
