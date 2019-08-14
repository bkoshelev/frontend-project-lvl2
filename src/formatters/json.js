import { flattenDeep } from 'lodash/fp';

const genPath = (path, key) => `${path}${path.length === 0 ? '' : '.'}${key}`;

const generateJsonFormatOutputText = (diffTree) => {
  const formatNodes = (nodes, pathToNodes = '') => {
    const formatNode = (node, pathToNode) => {
      const types = {
        nested: () => formatNodes(node.children, pathToNode),
        unchanged: () => [],
        added: ({ meta: { value2 } }) => ({
          event: 'added',
          oldValue: null,
          newValue: value2,
          path: pathToNode,
        }),
        removed: ({ meta: { value1 } }) => ({
          event: 'removed',
          oldValue: value1,
          newValue: null,
          path: pathToNode,
        }),
        changed: ({ meta: { value1, value2 } }) => ({
          event: 'changed',
          oldValue: value1,
          newValue: value2,
          path: pathToNode,
        }),
      };
      return types[node.nodeType](node);
    };

    return nodes.map((node) => {
      const pathToNode = genPath(
        pathToNodes,
        node.meta.propKey,
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
