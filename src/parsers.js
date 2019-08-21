import yaml from 'js-yaml';
import { parse as parseIni } from 'ini';

const parsers = {
  '.json': JSON.parse,
  '.yaml': yaml.safeLoad,
  '.ini': parseIni,
};

const parseFileContent = (fileExt, content) => {
  const parsedData = parsers[fileExt](content);
  return parsedData;
};

export default parseFileContent;
