import { isObject, flattenDeep } from 'lodash/fp';
import join from 'lodash/fp/join';

const sp = count => ' '.repeat(count);

const nodeTypes = {
  unchanged: {
    visualChar: ' ',
    selectedValue: 'value1',
  },
  added: {
    visualChar: '+',
    selectedValue: 'value2',
  },
  removed: {
    visualChar: '-',
    selectedValue: 'value1',
  },
};

const stringlifyNode = (node, level) => {
  if (node.nodeType === 'changed') {
    if (node.children.length > 0) {
      return stringlifyNode({ ...node, nodeType: 'unchanged' }, level);
    }
    return [
      stringlifyNode({ ...node, nodeType: 'removed' }, level),
      stringlifyNode({ ...node, nodeType: 'added' }, level),
    ];
  }
  if (Object.keys(nodeTypes).includes(node.nodeType)) {
    const propValue = node[nodeTypes[node.nodeType].selectedValue];
    const openBraceIndent = [
      `${sp(level + 1)}`,
      `${nodeTypes[node.nodeType].visualChar}`,
      `${node.propKey}: `,
    ].join(' ');

    if (node.children.length > 0) {
      const openBrace = `${openBraceIndent}{`;
      const content = node.children.map(child => stringlifyNode(child, level + 4));
      const closeBrace = `${sp(level + 4)}}`;

      return [
        openBrace,
        content,
        closeBrace,
      ];
    }

    if (isObject(propValue)) {
      const openBrace = `${openBraceIndent}{`;
      const content = Object.entries(propValue)
        .map(([key, value]) => `${sp(level + 8)}${key}: ${value}`);
      const closeBrace = `${sp(level + 4)}}`;

      return [
        openBrace,
        content,
        closeBrace,
      ];
    }

    return `${openBraceIndent}${propValue}`;
  }
  throw new Error('unknown node type');
};

const stringlifyNodes = (nodes, level = 0) => nodes.map(node => stringlifyNode(node, level));

const stringlifyDiffTree = diffTree => ['{', stringlifyNodes(diffTree), '}'];

const generatePrettyFormatOutput = diffTree => diffTree
  |> stringlifyDiffTree
  |> flattenDeep
  |> join('\n');

export default generatePrettyFormatOutput;
