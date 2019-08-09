import map from 'lodash/fp/map';
import {
  isObject, flattenDeep, entries, size, mapKeys,
} from 'lodash/fp';
import join from 'lodash/fp/join';
import { sp } from '../utils';

const stringify = (obj, spaceIndent = '') => {
  if (size(obj) === 0) return '{}';

  const openBrace = '{';

  const lines = obj
    |> entries
    |> map(([key, value]) => (isObject(value)
      ? `${spaceIndent + sp(2)}${key}: ${stringify(value, spaceIndent + sp(4))}`
      : `${spaceIndent + sp(2)}${key}: ${value}`));

  const closeBrace = `${spaceIndent}}`;

  return [openBrace, lines, closeBrace]
    |> flattenDeep
    |> join('\n');
};

const formatObjectValue = obj => mapKeys(key => sp(2) + key, obj);
const formatPropValue = value => (isObject(value) ? formatObjectValue(value) : value);

const formatNodesToObj = (nodes) => {
  const formatNode = (node) => {
    switch (node.nodeType) {
      case 'unchanged': {
        const { value1, propKey } = node;
        return {
          [`  ${propKey}`]: formatPropValue(value1),
        };
      }
      case 'added': {
        const { value2, propKey } = node;
        return {
          [`+ ${propKey}`]: formatPropValue(value2),
        };
      }
      case 'removed': {
        const { value1, propKey } = node;
        return {
          [`- ${propKey}`]: formatPropValue(value1),
        };
      }
      case 'changed': {
        const {
          children, propKey, value1, value2,
        } = node;
        if (children.length > 0) {
          return { [`  ${node.propKey}`]: formatNodesToObj(node.children) };
        }
        return ({
          [`- ${propKey}`]: formatPropValue(value1),
          [`+ ${propKey}`]: formatPropValue(value2),
        });
      }
      default: throw new Error('unknown node type');
    }
  };

  return nodes.reduce((acc, node) => {
    const text = formatNode(node);
    return { ...acc, ...text };
  }, {});
};

const generateNormalFormatOutput = diffTree => diffTree
  |> formatNodesToObj
  |> stringify;

export default generateNormalFormatOutput;
