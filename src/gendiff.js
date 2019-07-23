import { readFileSync } from "fs";
import { has } from "lodash/fp";
import { resolve, extname } from "path";

import parseFilesContent from "./parsers";

const readFiles = ([pathToFile1, pathToFile2]) => [
  {
    fileExt: extname(pathToFile1),
    content: readFileSync(resolve(pathToFile1), "utf8")
  },
  {
    fileExt: extname(pathToFile2),
    content: readFileSync(resolve(pathToFile2), "utf8")
  }
];

const generateDiffOutput = ([beforeJson, afterJson]) => {
  const keys = [...Object.keys(beforeJson), ...Object.keys(afterJson)].reduce(
    (acc, key) => (acc.includes(key) ? acc : [...acc, key]),
    []
  );

  const outputJson = keys.reduce((acc, key) => {
    const newAcc = [...acc];
    if (has(key, afterJson)) {
      if (has(key, beforeJson)) {
        if (afterJson[key] === beforeJson[key]) {
          newAcc.push(`    ${key}: ${beforeJson[key]}\n`);
        } else {
          newAcc.push(`  - ${key}: ${beforeJson[key]}\n`);
          newAcc.push(`  + ${key}: ${afterJson[key]}\n`);
        }
      } else {
        newAcc.push(`  + ${key}: ${afterJson[key]}\n`);
      }
    } else {
      newAcc.push(`  - ${key}: ${beforeJson[key]}\n`);
    }
    return newAcc;
  }, []);
  const output = ["{\n", ...outputJson, "}"].join("");
  return output;
};

const gendiff = (pathToFile1, pathToFile2) => {
  const diffOutput =
    [pathToFile1, pathToFile2]
    |> readFiles
    |> parseFilesContent
    |> generateDiffOutput;
  return diffOutput;
};

export default gendiff;
