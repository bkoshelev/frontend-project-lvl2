import map from 'lodash/fp/map';
import { isObject, flattenDeep } from 'lodash/fp';
import join from 'lodash/fp/join';
import { sp } from '../utils';

const stringify = (obj, spaceIndent = '') => {
  const getProp = (key, value, spaces) => (isObject(value)
    ? `${spaces + sp(2)}${key}: ${stringify(value, spaces + sp(4))}`
    : `${spaces + sp(2)}${key}: ${value}`);

  if (Object.entries(obj).length === 0) {
    return '{}';
  }
  const openBrace = '{';
  const closeBrace = `${spaceIndent}}`;
  const lines = obj
    |> Object.entries
    |> map(([key, value]) => getProp(key, value, spaceIndent));

  return [openBrace, lines, closeBrace]
    |> flattenDeep
    |> join('\n');
};

const formatObjectValue = obj => Object.entries(obj)
  .reduce((acc, [key, value]) => ({ ...acc, [sp(2) + key]: value }), {});

const formateNodeToObject = (node) => {
  const formateNodeToObjectByType = {
    unchanged: ({ value1, propKey }) => ({
      [`  ${propKey}`]: isObject(value1) ? formatObjectValue(value1) : value1,
    }),
    added: ({ propKey, value2 }) => ({
      [`+ ${propKey}`]: isObject(value2) ? formatObjectValue(value2) : value2,
    }),
    removed: ({ propKey, value1 }) => ({
      [`- ${propKey}`]: isObject(value1) ? formatObjectValue(value1) : value1,
    }),
    changed: node => ({
      ...formateNodeToObjectByType.removed(node),
      ...formateNodeToObjectByType.added(node),
    }),
    nodeList: ({ children, propKey }) => {
      const value = children
        .reduce((acc, child) => ({ ...acc, ...formateNodeToObject(child) }), {});
      return propKey === 'root' ? value : { [`  ${propKey}`]: value };
    },
  };
  return formateNodeToObjectByType[node.nodeType](node);
};

const generateDefaultFormatOutputText = structure => structure
  |> formateNodeToObject
  |> stringify;

export default generateDefaultFormatOutputText;
