import { flattenDeep } from 'lodash/fp';
import join from 'lodash/fp/join';
import { genPath, formatValue } from '../utils';

const generatePlainFormatOutputText = (diffTree) => {
  const formateNodes = (nodes, pathToNodes = '') => {
    const formatNode = (node, pathToNode) => {
      switch (node.nodeType) {
        case 'unchanged':
          return [];
        case 'added': {
          const { value2 } = node;
          return `Property '${pathToNode}' was added with value: ${formatValue(
            value2,
          )}`;
        }
        case 'removed':
          return `Property '${pathToNode}' was removed`;
        case 'changed': {
          const { value1, value2 } = node;
          return `Property '${pathToNode}' was updated. From ${formatValue(
            value1,
          )} to ${formatValue(value2)}`;
        }
        default: throw new Error('unknown node type');
      }
    };

    return nodes.map((node) => {
      const pathToNode = genPath(pathToNodes, node.propKey);
      if (node.children.length > 0) return formateNodes(node.children, pathToNode);
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
