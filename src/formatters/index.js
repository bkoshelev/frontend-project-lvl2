import generateJsonFormatOutput from './json';
import generatePlainFormatOutput from './plain';
import generateNormalFormatOutput from './normal';

const getFormatter = (diffTree, format = 'defaultOption') => {
  switch (format) {
    case 'normal':
      return generateNormalFormatOutput(diffTree);
    case 'plain':
      return generatePlainFormatOutput(diffTree);
    case 'json':
      return generateJsonFormatOutput(diffTree);
    default:
      throw Error('invalid format option');
  }
};

export default getFormatter;
