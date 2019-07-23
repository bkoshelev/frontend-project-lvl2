import yaml from "js-yaml";

const parseFile = ({ fileExt, content }) => {
  const parsers = {
    ".json": parseContent => JSON.parse(parseContent),
    ".yaml": parseContent => yaml.safeLoad(parseContent)
  };
  return parsers[fileExt](content);
};

const parseFilesContent = ([file1, file2]) => [
  parseFile(file1),
  parseFile(file2)
];

export default parseFilesContent;
