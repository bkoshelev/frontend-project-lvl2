import program from 'commander';
import packageData from '../../package.json';

program
  .description(packageData.description)
  .version(packageData.version)
  .parse(process.argv);
