import { flattenDeep } from 'lodash/fp';
import join from 'lodash/fp/join';
import { genPath, formatValue } from '../utils';


const generatePlainFormatOutputText = (structure) => {
  const formateNode = (node, path = '') => {
    const types = {
      unchanged: () => [],
      added: ({ value2 }) => `Property '${path}' was added with value: ${formatValue(
        value2,
      )}`,
      removed: () => `Property '${path}' was removed`,
      changed: ({ value1, value2 }) => `Property '${path}' was updated. From ${formatValue(
        value1,
      )} to ${formatValue(value2)}`,
      nodeList: ({ children }) => {
        const text = children.map(child => formateNode(child, genPath(
          path,
          child.propKey,
        )));
        return text;
      },
    };
    return types[node.nodeType](node);
  };

  const outputText = structure
    |> formateNode
    |> flattenDeep
    |> join('\n');
  return outputText;
};

export default generatePlainFormatOutputText;
