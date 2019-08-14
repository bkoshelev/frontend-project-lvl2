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

  if (isObject(propValue)) {
    const content = Object.entries(propValue)
      .map(([key, value]) => `${sp(spaceIndent + 8)}${key}: ${value}`);

    return [
      [openBrace, ' {'].join(''),
      content,
      closeBrace,
    ];
  }

  return [openBrace, ' ', propValue].join('');
};


const stringlifyNodes = (nodes, spaceIndent = 0) => {
  const stringlifyNode = (node) => {
    const nodeTypes = {
      nested: ({ children, meta: { propKey } }) => {
        const { openBrace, closeBrace } = stringlifyBraces(propKey, spaceIndent, ' ');

        return [
          [openBrace, ' {'].join(''),
          stringlifyNodes(children, spaceIndent + 4),
          closeBrace,
        ];
      },
      changed: ({ meta: { propKey, value1, value2 } }) => [
        stringlifyProp(propKey, value1, spaceIndent, '-'),
        stringlifyProp(propKey, value2, spaceIndent, '+'),
      ],
      unchanged: ({ meta: { propKey, value1 } }) => stringlifyProp(propKey, value1, spaceIndent, ' '),
      added: ({ meta: { propKey, value2 } }) => stringlifyProp(propKey, value2, spaceIndent, '+'),
      removed: ({ meta: { propKey, value1 } }) => stringlifyProp(propKey, value1, spaceIndent, '-'),
    };

    return nodeTypes[node.nodeType](node);
  };
  return nodes.map(node => stringlifyNode(node));
};

const stringlifyDiffTree = diffTree => ['{', stringlifyNodes(diffTree), '}'];

const generatePrettyFormatOutput = diffTree => diffTree
  |> stringlifyDiffTree
  |> flattenDeep
  |> join('\n');

export default generatePrettyFormatOutput;
