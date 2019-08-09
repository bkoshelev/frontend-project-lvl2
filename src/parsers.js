import yaml from 'js-yaml';
import { parse as parseIni } from 'ini';

const parseFileContent = (fileExt, parseContent) => {
  switch (fileExt) {
    case '.json': {
      try {
        return JSON.parse(parseContent);
      } catch (error) {
        throw new Error('invalid JSON file content');
      }
    }
    case '.yaml':
      return yaml.safeLoad(parseContent);
    case '.ini':
      return parseIni(parseContent);
    default:
      throw Error('invalid file extension');
  }
};

export default parseFileContent;
