import { has, isObject, isString } from "lodash/fp";

const formatValue = value => {
  if (isObject(value)) return "[complex value]";
  if (isString(value)) return `'${value}'`;
  return value;
};

const genPath = (path, key) => {
  return `${path}${path.length === 0 ? "" : "."}${key}`;
};

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
