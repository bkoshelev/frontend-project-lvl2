import yaml from 'js-yaml';
import { parse } from 'ini';
import { extname } from 'path';


const parseFile = ({ fileName, fileContent }) => {
  const parsers = {
    '.json': (parseContent) => {
      try {
        return JSON.parse(parseContent);
      } catch (error) {
        throw new Error('invalid JSON file content');
      }
    },
    '.yaml': parseContent => yaml.safeLoad(parseContent),
    '.ini': parseContent => parse(parseContent),
  };

  return parsers[extname(fileName)](fileContent);
};

const parseFileContents = files => files.map(file => parseFile(file));

export default parseFileContents;
