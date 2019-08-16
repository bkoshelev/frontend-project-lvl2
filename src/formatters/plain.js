import { flattenDeep, isObject, isString } from 'lodash/fp';
import join from 'lodash/fp/join';

const genPath = (path, key) => `${path}${path.length === 0 ? '' : '.'}${key}`;

const formatValue = (value) => {
  if (isObject(value)) {
    return '[complex value]';
  }
  if (isString(value)) {
    return `'${value}'`;
  }
  return value;
};

const types = {
  nested: ({ children }, pathToNode) => formateNodes(children, pathToNode),
  unchanged: () => [],
  added: ({ value2 }, pathToNode) => `Property '${pathToNode}' was added with value: ${formatValue(
    value2,
  )}`,
  removed: (_, pathToNode) => `Property '${pathToNode}' was removed`,
  changed: ({ value1, value2 }, pathToNode) => {
    const text = `Property '${pathToNode}' was updated. From ${formatValue(value1)} to ${formatValue(value2)}`;
    return text;
  }
  ,
};

const formatNode = (node, pathToNode) => types[node.nodeType](node, pathToNode);

const formateNodes = (nodes, pathToNodes = '') => nodes.map((node) => {
  const pathToNode = genPath(pathToNodes, node.propKey);
  return formatNode(node, pathToNode);
});

const generatePlainFormatOutputText = (diffTree) => {
  const outputText = diffTree
    |> formateNodes
    |> flattenDeep
    |> join('\n');
  return outputText;
};

export default generatePlainFormatOutputText;
