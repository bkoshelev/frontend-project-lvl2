import { isObject, flattenDeep } from 'lodash/fp';
import join from 'lodash/fp/join';

const sp = count => ' '.repeat(count);

const stringlifyBraces = (key, spaceIndent, visualChar) => {
  const openBrace = [
    `${sp(spaceIndent + 1)}`,
    `${visualChar}`,
    `${key}:`,
  ].join(' ');

  return {
    openBrace,
    closeBrace: `${sp(spaceIndent + 4)}}`,
  };
};

const stringlifyProp = (propKey, propValue, spaceIndent, visualChar) => {
  const { openBrace, closeBrace } = stringlifyBraces(propKey, spaceIndent, visualChar);

  if (!isObject(propValue)) {
    return [openBrace, ' ', propValue].join('');
  }

  const content = Object.entries(propValue)
    .map(([key, value]) => `${sp(spaceIndent + 8)}${key}: ${value}`);

  return [
    [openBrace, ' {'].join(''),
    content,
    closeBrace,
  ];
};

const nodeTypes = {
  nested: ({ children, propKey }, spaceIndent) => {
    const { openBrace, closeBrace } = stringlifyBraces(propKey, spaceIndent, ' ');

    return [
      [openBrace, ' {'].join(''),
      stringlifyNodes(children, spaceIndent + 4),
      closeBrace,
    ];
  },
  changed: ({ propKey, value1, value2 }, spaceIndent) => [
    stringlifyProp(propKey, value1, spaceIndent, '-'),
    stringlifyProp(propKey, value2, spaceIndent, '+'),
  ],
  unchanged: ({ propKey, value1 }, spaceIndent) => stringlifyProp(propKey, value1, spaceIndent, ' '),
  added: ({ propKey, value2 }, spaceIndent) => stringlifyProp(propKey, value2, spaceIndent, '+'),
  removed: ({ propKey, value1 }, spaceIndent) => stringlifyProp(propKey, value1, spaceIndent, '-'),
};

const stringlifyNode = (node, spaceIndent) => nodeTypes[node.nodeType](node, spaceIndent);

const stringlifyNodes = (nodes, spaceIndent = 0) => {
  const string = nodes.map(node => stringlifyNode(node, spaceIndent));
  return string;
};

const stringlifyDiffTree = diffTree => ['{', stringlifyNodes(diffTree), '}'];

const generatePrettyFormatOutput = diffTree => diffTree
  |> stringlifyDiffTree
  |> flattenDeep
  |> join('\n');

export default generatePrettyFormatOutput;
