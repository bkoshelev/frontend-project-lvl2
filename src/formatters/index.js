import generateJsonFormatOutput from './json';
import generatePlainFormatOutput from './plain';
import generatePrettyFormatOutput from './pretty';

const getFormatter = (diffTree, format = 'pretty') => {
  const formatters = {
    pretty: generatePrettyFormatOutput,
    plain: generatePlainFormatOutput,
    json: generateJsonFormatOutput,
  };
  return formatters[format](diffTree);
};

export default getFormatter;
