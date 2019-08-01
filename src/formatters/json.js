import { flattenDeep } from 'lodash/fp';
import { genPath, formatValue } from '../utils';


const generateJsonFormatOutputText = (structure) => {
  const genJson = key => details => ({ key, details });
  const formatNode = (node, path = '') => {
    const genJsonWithKey = genJson(path);
    const types = {
      unchanged: () => [],
      added: ({ value2 }) => genJsonWithKey(`Property '${path}' was added with value: ${formatValue(value2)}`),
      removed: () => genJsonWithKey(`Property '${path}' was removed`),
      changed: ({ value1, value2 }) => genJsonWithKey(`Property '${path}' was updated. From ${formatValue(value1)} to ${formatValue(
        value2,
      )}`),
      nodeList: ({ children }) => {
        const json = children.map(child => formatNode(child, genPath(
          path,
          child.propKey,
        )));
        return json;
      },
    };

    return types[node.nodeType](node);
  };

  const diffs = structure
    |> formatNode
    |> flattenDeep;

  const outputText = {
    diffs,
  };

  return JSON.stringify(outputText, undefined, 2);
};

export default generateJsonFormatOutputText;
