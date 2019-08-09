import { flattenDeep } from 'lodash/fp';
import { genPath, formatValue } from '../utils';

const generateJsonFormatOutputText = (diffTree) => {
  const genJson = key => details => ({ key, details });

  const formatNodes = (nodes, pathToNodes = '') => {
    const formatNode = (node, pathToNode) => {
      const genJsonWithKey = genJson(pathToNode);
      switch (node.nodeType) {
        case 'unchanged':
          return [];
        case 'added': {
          const { value2 } = node;
          return genJsonWithKey(`Property '${pathToNode}' was added with value: ${formatValue(value2)}`);
        }
        case 'removed': {
          return genJsonWithKey(`Property '${pathToNode}' was removed`);
        }
        case 'changed': {
          const { value1, value2 } = node;
          return genJsonWithKey(`Property '${pathToNode}' was updated. From ${formatValue(value1)} to ${formatValue(
            value2,
          )}`);
        }
        default: throw new Error('unknown node type');
      }
    };

    return nodes.map((node) => {
      const pathToNode = genPath(
        pathToNodes,
        node.propKey,
      );
      if (node.children.length > 0) {
        return formatNodes(node.children, pathToNode);
      }
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
