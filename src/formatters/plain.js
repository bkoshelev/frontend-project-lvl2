import { flattenDeep, isObject, isString } from 'lodash/fp';
import join from 'lodash/fp/join';

const genPath = (path, key) => `${path}${path.length === 0 ? '' : '.'}${key}`;

const formatValue = (value) => {
  if (isObject(value)) return '[complex value]';
  if (isString(value)) return `'${value}'`;
  return value;
};

const generatePlainFormatOutputText = (diffTree) => {
  const formateNodes = (nodes, pathToNodes = '') => {
    const formatNode = (node, pathToNode) => {
      const types = {
        nested: ({ children }) => formateNodes(children, pathToNode),
        unchanged: () => [],
        added: ({ meta: { value2 } }) => `Property '${pathToNode}' was added with value: ${formatValue(
          value2,
        )}`,
        removed: () => `Property '${pathToNode}' was removed`,

        changed: ({ meta: { value1, value2 } }) => `Property '${pathToNode}' was updated. From ${formatValue(value1)} to ${formatValue(value2)}`,
      };
      return types[node.nodeType](node);
    };

    return nodes.map((node) => {
      const pathToNode = genPath(pathToNodes, node.meta.propKey);
      return formatNode(node, pathToNode);
    });
  };

  const outputText = diffTree
    |> formateNodes
    |> flattenDeep
    |> join('\n');
  return outputText;
};

export default generatePlainFormatOutputText;
