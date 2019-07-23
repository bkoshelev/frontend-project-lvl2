import yaml from "js-yaml";
import { parse } from "ini";
import { extname } from "path";

const parseFile = ({ name, content }) => {
  const parsers = {
    ".json": parseContent => JSON.parse(parseContent),
    ".yaml": parseContent => yaml.safeLoad(parseContent),
    ".ini": parseContent => parse(parseContent)
  };
  return parsers[extname(name)](content);
};

const parseFilesContent = files => files.map(file => parseFile(file));

export default parseFilesContent;
