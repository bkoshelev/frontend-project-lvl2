#!/usr/bin/env node

import program from 'commander';
import packageData from '../../package.json';

program
  .arguments('<firstConfig>')
  .arguments('<secondConfig>')
  .description(packageData.description)
  .version(packageData.version)
  .option('-f, --format [type]', 'Output format')
  .action((firstConfig, secondConfig) => {})
  .parse(process.argv);
