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

const parseText = (fileExt, fileContent) => parseFile(fileExt)(fileContent);

export default parseText;
