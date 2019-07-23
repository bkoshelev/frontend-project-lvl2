import { readFileSync } from "fs";
import { has, isObject, uniq } from "lodash/fp";
import sortBy from "lodash/fp/sortBy";
import { resolve, basename } from "path";

import parseFilesContent from "./parsers";

const readFiles = paths =>
  paths.map(path => {
    return {
      name: basename(path),
      content: readFileSync(resolve(path), "utf8")
    };
  });

const generateAstDiff = ([beforeObj, afterObj], level = 1) => {
  const keys =
    [...Object.keys(beforeObj), ...Object.keys(afterObj)]
    |> uniq
    |> sortBy(el => el);

  const ast = keys.reduce((acc, key) => {
    const newAcc = [...acc];
    if (isObject(beforeObj[key]) && isObject(afterObj[key])) {
      newAcc.push({
        type: "children",
        key,
        value: generateAstDiff([beforeObj[key], afterObj[key]], level + 1)
      });
    } else if (has(key, beforeObj) && !has(key, afterObj)) {
      newAcc.push({
        type: "removed",
        key,
        oldValue: beforeObj[key]
      });
    } else if (!has(key, beforeObj) && has(key, afterObj)) {
      newAcc.push({
        type: "added",
        key,
        newValue: afterObj[key]
      });
    } else if (beforeObj[key] === afterObj[key]) {
      newAcc.push({
        type: "equal",
        key,
        value: beforeObj[key]
      });
    } else if (beforeObj[key] !== afterObj[key]) {
      newAcc.push({
        type: "changed",
        key,
        oldValue: beforeObj[key],
        newValue: afterObj[key]
      });
    }

    return newAcc;
  }, []);
  return ast;
};

const generateOutput = ast => {
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

const gendiff = (pathToFile1, pathToFile2) => {
  const diffOutput =
    [pathToFile1, pathToFile2]
    |> readFiles
    |> parseFilesContent
    |> generateAstDiff
    |> generateOutput;
  return diffOutput;
};

export default gendiff;
export { generateAstDiff };
