#!/usr/bin/env node

import program from 'commander';
import packageData from '../../package.json';

import gendiff from '../gendiff';

program
  .arguments('<firstConfig>')
  .arguments('<secondConfig>')
  .description(packageData.description)
  .version(packageData.version)
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => {
    const output = gendiff(firstConfig, secondConfig);
    console.log(output);
  })
  .parse(process.argv);
