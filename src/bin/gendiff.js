#!/usr/bin/env node

import program from 'commander';
import packageData from '../../package.json';
import gendiff from '../gendiff';

program
  .arguments('<firstConfig>')
  .arguments('<secondConfig>')
  .description(packageData.description)
  .version(packageData.version)
  .option('-f, --format [type]', 'Output format', 'default')
  .action((pathToFile1, pathToFile2, { format: outputFormatOption }) => {
    const outputText = gendiff(pathToFile1, pathToFile2, outputFormatOption);
    console.log(outputText);
  })
  .parse(process.argv);
