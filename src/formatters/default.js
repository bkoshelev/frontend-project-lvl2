import { isObject, has } from 'lodash/fp';

const generateDefaultOutput = (ast) => {
  const addValue = (key, value, depthLevel, tab, delimiter = '') => {
    const addObject = (obj, level) => `{\n${Object.entries(obj).map(([propKey, propValue]) => addValue(propKey, propValue, level, 4))}${' '.repeat(level * 4)}}`;

    return `${' '.repeat(depthLevel * 4 + tab)}${delimiter}${key}: ${
      isObject(value) ? addObject(value, depthLevel + 1) : value
    }\n`;
  };

  const addProperties = (props = [], depthLevel = 0) => {
    const typesAction = {
      equal: ({ value, key }, level) => addValue(key, value, level, 4),
      added: ({ newValue, key }, level) => addValue(key, newValue, level, 2, '+ '),
      removed: ({ oldValue, key }, level) => addValue(key, oldValue, level, 2, '- '),
      changed: ({ oldValue, newValue, key }, level) => addValue(key, oldValue, level, 2, '- ')
        + addValue(key, newValue, level, 2, '+ '),
      list: ({ value, key }, level) => `${' '.repeat(level * 4 + 4)}${key}: {\n${addProperties(
        value,
        level + 1,
      )}${' '.repeat(level * 4 + 4)}}\n`,
    };

    const addProp = (prop, level) => {
      const defaultType = '';
      return has(prop.type, typesAction)
        ? typesAction[prop.type](prop, level)
        : defaultType;
    };

    return props.reduce((acc, prop) => acc + addProp(prop, depthLevel), '');
  };

  const output = `{\n${addProperties(ast)}}`;
  return output;
};

export default generateDefaultOutput;
