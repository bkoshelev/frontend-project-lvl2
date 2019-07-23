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
  .action((firstConfig, secondConfig, { format }) => {
    [firstConfig, secondConfig].forEach(path => {
      if (!existsSync(path)) {
        throw Error(`file ${path} not exist`);
      }
    });
    if (!["json", "plain", "default"].includes(format)) {
      throw Error("invalid format argument");
    }

    const output = gendiff(firstConfig, secondConfig, format);
    console.log(output);
  })
  .parse(process.argv);
