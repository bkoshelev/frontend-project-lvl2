import { trim } from 'lodash/fp';
import { genPath, formatValue } from '../utils';

const generatePlainFormatOutputText = (structure) => {
  const genOutputLines = (nodes, currentPath = '') => nodes.map((node) => {
    const outputLineByTypeList = {
      unchanged: () => '',
      added: ({ value2, propKey }, path) => `Property '${genPath(path, propKey)}' was added with value: ${formatValue(
        value2,
      )}\n`,
      removed: ({ propKey }, path) => `Property '${genPath(path, propKey)}' was removed\n`,
      changed: ({ value1, value2, propKey }, pathToProp) => `Property '${genPath(pathToProp, propKey)}' was updated. From ${formatValue(
        value1,
      )} to ${formatValue(value2)}\n`,
      nodeList: ({ children }, pathToProp) => {
        const outputLines = genOutputLines(children, genPath(pathToProp, node.propKey));
        return outputLines;
      },
    };
    const newOutputLine = outputLineByTypeList[node.nodeType](node, currentPath);
    return newOutputLine;
  }).join('');

  const outputText = genOutputLines(structure);
  return trim(outputText);
};

export default generatePlainFormatOutputText;
