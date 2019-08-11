import yaml from 'js-yaml';
import { parse as parseIni } from 'ini';

const parseFileContent = (fileExt, parseContent) => {
  const parsers = {
    '.json': JSON.parse,
    '.yaml': yaml.safeLoad,
    '.ini': parseIni,
  };

  return parsers[fileExt](parseContent);
};

export default parseFileContent;
