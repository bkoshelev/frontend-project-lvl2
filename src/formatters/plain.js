import { flattenDeep } from 'lodash/fp';
import join from 'lodash/fp/join';
import { genPath, formatValue } from '../utils';


const generatePlainFormatOutputText = (diffStructure) => {
  const formateNodes = (nodes, pathToNodes = '') => {
    const types = path => ({
      unchanged: () => [],
      added: ({ value2 }) => `Property '${path}' was added with value: ${formatValue(
        value2,
      )}`,
      removed: () => `Property '${path}' was removed`,
      changed: ({ value1, value2 }) => `Property '${path}' was updated. From ${formatValue(
        value1,
      )} to ${formatValue(value2)}`,
    });

    return nodes.map((node) => {
      const pathToNode = genPath(pathToNodes, node.propKey);
      if (node.children.length > 0) {
        return formateNodes(node.children, pathToNode);
      }
      return types(pathToNode)[node.nodeType](node);
    });
  };

  const outputText = diffStructure
    |> formateNodes
    |> flattenDeep
    |> join('\n');
  return outputText;
};

export default generatePlainFormatOutputText;
