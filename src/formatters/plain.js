import { isObject, isString, trim, has } from "lodash/fp";

const formatValue = value => {
  if (isObject(value)) return "[complex value]";
  if (isString(value)) return `'${value}'`;
  return value;
};

const genPath = (path, key) => {
  return `${path}${path.length === 0 ? "" : "."}${key}`;
};

const generatePlainFormatOutput = ast => {
  const addProperties = (props = [], currentPath = "") => {
    const typesAction = {
      equal: () => "",
      added: ({ newValue, key }, path) =>
        `Property '${genPath(path, key)}' was added with value: ${formatValue(
          newValue
        )}\n`,
      removed: ({ key }, path) =>
        `Property '${genPath(path, key)}' was removed\n`,

      changed: ({ oldValue, newValue, key }, path) =>
        `Property '${genPath(path, key)}' was updated. From ${formatValue(
          oldValue
        )} to ${formatValue(newValue)}\n`,
      list: ({ value, key }, path) => addProperties(value, genPath(path, key))
    };

    const addProp = (prop, pathToProp) => {
      const defaultType = "";
      return has(prop.type, typesAction)
        ? typesAction[prop.type](prop, pathToProp)
        : defaultType;
    };

    return props.reduce((acc, prop) => {
      return acc + addProp(prop, currentPath);
    }, "");
  };

  const output = addProperties(ast);
  return trim(output);
};

export default generatePlainFormatOutput;
