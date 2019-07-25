import { has } from "lodash/fp";
import { genPath, formatValue } from "../utils";

const generateJsonFormatOutput = ast => {
  const addProperties = (props = [], currentPath = "") => {
    const typesAction = {
      added: ({ newValue, key }, path) => [
        {
          key: genPath(path, key),
          details: `Property '${genPath(
            path,
            key
          )}' was added with value: ${formatValue(newValue)}`
        }
      ],
      removed: ({ key }, path) => [
        {
          key: genPath(path, key),
          details: `Property '${genPath(path, key)}' was removed`
        }
      ],

      changed: ({ oldValue, newValue, key }, path) => [
        {
          key: genPath(path, key),
          details: `Property '${genPath(
            path,
            key
          )}' was updated. From ${formatValue(oldValue)} to ${formatValue(
            newValue
          )}`
        }
      ],
      list: ({ value, key }, path) => addProperties(value, genPath(path, key))
    };

    const addProp = (prop, pathToProp) => {
      const defaultType = [];
      return has(prop.type, typesAction)
        ? typesAction[prop.type](prop, pathToProp)
        : defaultType;
    };

    return props.reduce((acc, value) => {
      return [...acc, ...addProp(value, currentPath)];
    }, []);
  };

  const output = {
    diffs: addProperties(ast)
  };
  return output;
};

export default generateJsonFormatOutput;
