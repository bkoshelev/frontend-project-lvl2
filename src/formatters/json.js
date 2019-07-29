import { genPath, formatValue } from '../utils';

const generateJsonFormatOutputText = (structure) => {
  const genOutputLines = (nodes, currentPath = '') => {
    const outputLineByTypeList = {
      unchanged: () => [],
      added: ({ value2, propKey }, path) => [
        {
          key: genPath(path, propKey),
          details: `Property '${genPath(
            path,
            propKey,
          )}' was added with value: ${formatValue(value2)}`,
        },
      ],
      removed: ({ propKey }, path) => [
        {
          key: genPath(path, propKey),
          details: `Property '${genPath(path, propKey)}' was removed`,
        },
      ],

      changed: ({ value1, value2, propKey }, path) => [
        {
          key: genPath(path, propKey),
          details: `Property '${genPath(
            path,
            propKey,
          )}' was updated. From ${formatValue(value1)} to ${formatValue(
            value2,
          )}`,
        },
      ],
      nodeList: (node, pathToProp) => {
        const outputLines = genOutputLines(node.children, genPath(pathToProp, node.propKey));
        return outputLines;
      },
    };

    if (nodes.length === 0) return '';
    return nodes.reduce((currentLines, node) => {
      const newOutputLine = outputLineByTypeList[node.nodeType](node, currentPath);
      return [...currentLines, ...newOutputLine];
    }, []);
  };

  const outputText = {
    diffs: genOutputLines(structure),
  };

  return JSON.stringify(outputText, undefined, 2);
};

export default generateJsonFormatOutputText;
