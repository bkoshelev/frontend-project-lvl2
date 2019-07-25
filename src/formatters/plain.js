import { trim } from 'lodash/fp';
import { genPath, formatValue } from '../utils';

const generatePlainFormatOutputText = (structure) => {
  console.log(structure);
  const outputLineByTypeList = {
    unchanged: () => '',
    added: ({ value2, propKey }, path) => `Property '${genPath(path, propKey)}' was added with value: ${formatValue(
      value2,
    )}\n`,
    removed: ({ propKey }, path) => `Property '${genPath(path, propKey)}' was removed\n`,
    changed: ({ value1, value2, propKey }, path) => `Property '${genPath(path, propKey)}' was updated. From ${formatValue(
      value1,
    )} to ${formatValue(value2)}\n`,
  };

  const genOutputLines = (nodes, currentPath = '') => {
    if (nodes.length === 0) return '';
    return nodes.map((node) => {
      const newOutputLine = outputLineByTypeList[node.nodeType](node, currentPath);
      const newPath = genPath(currentPath, node.propKey);
      const childrenLines = genOutputLines(node.children, newPath);
      return newOutputLine + childrenLines;
    }).join('');
  };

  const outputText = genOutputLines(structure);
  return trim(outputText);
};

export default generatePlainFormatOutputText;
