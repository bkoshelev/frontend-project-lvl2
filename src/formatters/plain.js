import { isObject, isString, trim } from "lodash/fp";

const generatePlainFormatOutput = ast => {
  let typesAction = () => {};
  let addValuesList = () => {};

  addValuesList = (children = [], path = "") => {
    return children.reduce((acc, value) => {
      return acc + typesAction[value.type](value, path);
    }, "");
  };

  const formatValue = value => {
    if (isObject(value)) return "[complex value]";
    if (isString(value)) return `'${value}'`;
    return value;
  };

  const genPath = (path, key) => {
    return `${path}${path.length === 0 ? "" : "."}${key}`;
  };

  typesAction = {
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
    children: ({ value, key }, path) => addValuesList(value, genPath(path, key))
  };

  const output = addValuesList(ast);
  return trim(output);
};

export default generatePlainFormatOutput;
