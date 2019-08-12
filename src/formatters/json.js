import { flattenDeep, isObject, isString } from 'lodash/fp';

const genPath = (path, key) => `${path}${path.length === 0 ? '' : '.'}${key}`;

const formatValue = (value) => {
  if (isObject(value)) return '[complex value]';
  if (isString(value)) return `'${value}'`;
  return value;
};

const generateJsonFormatOutputText = (diffTree) => {
  const genJson = key => details => ({ key, details });

  const formatNodes = (nodes, pathToNodes = '') => {
    const formatNode = (node, pathToNode) => {
      const genJsonWithKey = genJson(pathToNode);

      const types = {
        unchanged: () => [],
        added: ({ value2 }) => genJsonWithKey(`Property '${pathToNode}' was added with value: ${formatValue(value2)}`),
        removed: () => genJsonWithKey(`Property '${pathToNode}' was removed`),
        changed: ({ value1, value2, children }) => (children.length > 0
          ? formatNodes(node.children, pathToNode)
          : genJsonWithKey(`Property '${pathToNode}' was updated. From ${formatValue(value1)} to ${formatValue(value2)}`)),
      };
      return types[node.nodeType](node);
    };

    return nodes.map((node) => {
      const pathToNode = genPath(
        pathToNodes,
        node.propKey,
      );
      return formatNode(node, pathToNode);
    });
  };

  const diffs = diffTree
    |> formatNodes
    |> flattenDeep;

  const outputText = {
    diffs,
  };

  return JSON.stringify(outputText, undefined, 2);
};

export default generateJsonFormatOutputText;
