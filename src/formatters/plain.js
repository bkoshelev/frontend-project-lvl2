import { trim, has } from "lodash/fp";
import { genPath, formatValue } from "../utils";

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
