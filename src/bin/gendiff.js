#!/usr/bin/env node

import program from 'commander';
import { existsSync } from 'fs';
import packageData from '../../package.json';
import gendiff from '../gendiff';
import { outputFormatOptionPossibleValues } from '../formatters';


program
  .arguments('<firstConfig>')
  .arguments('<secondConfig>')
  .description(packageData.description)
  .version(packageData.version)
  .option('-f, --format [type]', 'Output format', 'default')
  .action((pathToFile1, pathToFile2, { format: outputFormatOption }) => {
    [pathToFile1, pathToFile2].forEach((pathToFile) => {
      if (!existsSync(pathToFile)) {
        throw Error(`file ${pathToFile} not exist`);
      }
    });
    if (!Object.values(outputFormatOptionPossibleValues).includes(outputFormatOption)) {
      throw Error(`invalid format option, try this: ${Object.values(outputFormatOptionPossibleValues).join(', ')}`);
    }

    const outputText = gendiff(pathToFile1, pathToFile2, outputFormatOption);
    console.log(outputText);
  })
  .parse(process.argv);
