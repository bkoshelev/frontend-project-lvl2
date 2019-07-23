import { isObject } from "lodash/fp";

const generateDefaultOutput = ast => {
  let typesAction = () => {};
  let addValuesList = () => {};

  const addValue = (key, value, level, tab, delimiter = "") =>
    `${" ".repeat(level * 4 + tab)}${delimiter}${key}: ${
      isObject(value) ? typesAction.object(value, level + 1) : value
    }\n`;

  addValuesList = (children = [], level = 0) => {
    return children.reduce((acc, value) => {
      return acc + typesAction[value.type](value, level);
    }, "");
  };

  typesAction = {
    equal: ({ value, key }, level) => addValue(key, value, level, 4),
    added: ({ newValue, key }, level) =>
      addValue(key, newValue, level, 2, "+ "),
    removed: ({ oldValue, key }, level) =>
      addValue(key, oldValue, level, 2, "- "),
    changed: ({ oldValue, newValue, key }, level) =>
      addValue(key, oldValue, level, 2, "- ") +
      addValue(key, newValue, level, 2, "+ "),
    object: (obj, level) =>
      `{\n${Object.entries(obj).map(([key, value]) =>
        typesAction.objectValue({ key, value }, level)
      )}${" ".repeat(level * 4)}}`,
    objectValue: ({ value, key }, level) => addValue(key, value, level, 4),
    children: ({ value, key }, level) =>
      `${" ".repeat(level * 4 + 4)}${key}: {\n${addValuesList(
        value,
        level + 1
      )}${" ".repeat(level * 4 + 4)}}\n`
  };

  const output = `{\n${addValuesList(ast)}}`;

  return output;
};

export default generateDefaultOutput;
