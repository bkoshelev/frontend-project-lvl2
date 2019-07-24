#!/usr/bin/env node

import program from "commander";
import { existsSync } from "fs";
import packageData from "../../package.json";

import gendiff from "../gendiff";

program
  .arguments("<firstConfig>")
  .arguments("<secondConfig>")
  .description(packageData.description)
  .version(packageData.version)
  .option("-f, --format [type]", "Output format", "default")
  .action((path1, path2, { format }) => {
    [path1, path2].forEach(path => {
      if (!existsSync(path)) {
        throw Error(`file ${path} not exist`);
      }
    });
    if (!["json", "plain", "default"].includes(format)) {
      throw Error("invalid format argument");
    }

    const output = gendiff(path1, path2, format);
    console.log(output);
  })
  .parse(process.argv);
