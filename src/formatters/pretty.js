import { isObject, flattenDeep } from 'lodash/fp';
import join from 'lodash/fp/join';

const sp = count => ' '.repeat(count);

const stringifyObject = (level, content) => [
  '{',
  content,
  [sp(level * 4), '}'].join(''),
].join('\n');

const stringifyProp = (propKey, propValue, level, visualChar = '') => {
  const openBrace = [
    `${sp(level * 4 - (visualChar ? 2 : 0))}`,
    `${visualChar}`,
    `${propKey}: `,
  ].join('');

  if (!isObject(propValue)) {
    return [openBrace, propValue].join('');
  }

  const content = Object.entries(propValue)
    .map(([key, value]) => stringifyProp(key, value, level + 1)).join('\n');

  return [openBrace, stringifyObject(level, content)].join('');
};

const nodeTypes = {
  nested: ({ children, propKey }, level) => {
    const content = stringifyNodes(children, level + 1);
    return stringifyProp(propKey, stringifyObject(level + 1, content), level + 1);
  },
  changed: ({ propKey, value1, value2 }, level) => [
    stringifyProp(propKey, value1, level + 1, '- '),
    stringifyProp(propKey, value2, level + 1, '+ '),
  ].join('\n'),
  unchanged: ({ propKey, value1 }, level) => stringifyProp(propKey, value1, level + 1),
  added: ({ propKey, value2 }, level) => stringifyProp(propKey, value2, level + 1, '+ '),
  removed: ({ propKey, value1 }, level) => stringifyProp(propKey, value1, level + 1, '- '),
};

const stringifyNode = (node, level) => nodeTypes[node.nodeType](node, level);

const stringifyNodes = (nodes, level = 0) => {
  const string = nodes.map(node => stringifyNode(node, level)).join('\n');
  return string;
};

const stringifyDiffTree = diffTree => ['{', stringifyNodes(diffTree), '}'];

const generatePrettyFormatOutput = diffTree => diffTree
  |> stringifyDiffTree
  |> flattenDeep
  |> join('\n');

export default generatePrettyFormatOutput;
