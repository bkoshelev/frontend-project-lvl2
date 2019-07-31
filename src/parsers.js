import { extname } from 'path';
import yaml from 'js-yaml';
import { parse as parseIni } from 'ini';
import { addNewParser, parseFile } from './store';

addNewParser('.json', (parseContent) => {
  try {
    return JSON.parse(parseContent);
  } catch (error) {
    throw new Error('invalid JSON file content');
  }
});
addNewParser('.yaml', parseContent => yaml.safeLoad(parseContent));
addNewParser('.ini', parseContent => parseIni(parseContent));

const parseFileContents = files => files
  .map(({ fileName, fileContent }) => parseFile(extname(fileName))(fileContent));


export default parseFileContents;
