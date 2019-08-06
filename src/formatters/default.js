import map from 'lodash/fp/map';
import {
  isObject, flattenDeep, entries, size, mapKeys,
} from 'lodash/fp';
import join from 'lodash/fp/join';
import { sp } from '../utils';

const stringify = (struct) => {
  const openBrace = '{';

  const stringifyObj = (obj, spaceIndent = '') => {
    const stringifyProp = (key, value, spaces) => (isObject(value)
      ? `${spaces + sp(2)}${key}: ${stringifyObj(value, spaces + sp(4))}`
      : `${spaces + sp(2)}${key}: ${value}`);

    if (size(obj) === 0) {
      return '{}';
    }
    const lines = obj
      |> entries
      |> map(([key, value]) => stringifyProp(key, value, spaceIndent));

    const closeBrace = `${spaceIndent}}`;
    return [openBrace, lines, closeBrace]
      |> flattenDeep
      |> join('\n');
  };

  return stringifyObj(struct);
};

const formatObjectValue = obj => mapKeys(key => sp(2) + key, obj);

const formatNodesToObj = (nodes) => {
  const types = {
    unchanged: ({ value1, propKey }) => ({
      [`  ${propKey}`]: isObject(value1) ? formatObjectValue(value1) : value1,
    }),
    added: ({ propKey, value2 }) => ({
      [`+ ${propKey}`]: isObject(value2) ? formatObjectValue(value2) : value2,
    }),
    removed: ({ propKey, value1 }) => ({
      [`- ${propKey}`]: isObject(value1) ? formatObjectValue(value1) : value1,
    }),
    changed: (changedTypeNode) => {
      if (changedTypeNode.children.length > 0) {
        const children = formatNodesToObj(changedTypeNode.children);
        return { [`  ${changedTypeNode.propKey}`]: children };
      }
      return ({
        ...types.removed(changedTypeNode),
        ...types.added(changedTypeNode),
      });
    },
  };

  return nodes.reduce((acc, node) => {
    const text = types[node.nodeType](node);
    return { ...acc, ...text };
  }, {});
};

const generateDefaultFormatOutputText = diffStructure => diffStructure
  |> formatNodesToObj
  |> stringify;
export default generateDefaultFormatOutputText;
