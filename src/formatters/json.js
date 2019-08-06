import { flattenDeep } from 'lodash/fp';
import { genPath, formatValue } from '../utils';


const generateJsonFormatOutputText = (diffStructure) => {
  const genJson = key => details => ({ key, details });

  const formatNodes = (nodes, pathToNodes = '') => {
    const getJsonByType = type => (pathToProp) => {
      const genJsonWithKey = genJson(pathToProp);
      const types = {
        unchanged: () => [],
        added: ({ value2 }) => genJsonWithKey(`Property '${pathToProp}' was added with value: ${formatValue(value2)}`),
        removed: () => genJsonWithKey(`Property '${pathToProp}' was removed`),
        changed: ({ value1, value2 }) => genJsonWithKey(`Property '${pathToProp}' was updated. From ${formatValue(value1)} to ${formatValue(
          value2,
        )}`),
      };
      return types[type];
    };

    return nodes.map((node) => {
      const pathToNode = genPath(
        pathToNodes,
        node.propKey,
      );
      if (node.children.length > 0) {
        const children = formatNodes(node.children, pathToNode);
        return children;
      }
      return getJsonByType(node.nodeType)(pathToNode)(node);
    });
  };

  const diffs = diffStructure
    |> formatNodes
    |> flattenDeep;

  const outputText = {
    diffs,
  };

  return JSON.stringify(outputText, undefined, 2);
};

export default generateJsonFormatOutputText;
