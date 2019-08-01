import { isObject, isString } from 'lodash/fp';

const genPath = (path, key) => `${path}${path.length === 0 ? '' : '.'}${key}`;

const formatValue = (value) => {
  if (isObject(value)) return '[complex value]';
  if (isString(value)) return `'${value}'`;
  return value;
};

const sp = count => ' '.repeat(count);

export { genPath, formatValue, sp };
