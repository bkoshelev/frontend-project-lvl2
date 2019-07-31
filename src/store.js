

const store = {
  formatters: {},
  parsers: {},
};

const { formatters, parsers } = store;

// formatters
const addNewFormatter = (formatName, formatter) => { formatters[formatName] = formatter; };
const getFormattersName = () => Object.entries(formatters)
  .reduce((acc, [key]) => ({ ...acc, [key]: key }), {});
const formatContent = (format = 'defaultOption') => {
  if (!Object.values(getFormattersName()).includes(format)) {
    throw Error(`invalid format option, try this: ${Object.values(getFormattersName()).join(', ')}`);
  }
  return formatters[format];
};

// parsers
const addNewParser = (fileExt, parser) => { parsers[fileExt] = parser; };
const parseFile = fileExt => parsers[fileExt];


export {
  formatContent, addNewFormatter, getFormattersName, addNewParser, parseFile,
};
