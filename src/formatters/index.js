import generateJsonFormatOutput from './json';
import generatePlainFormatOutput from './plain';
import generateDefaultOutput from './default';

const outputFormatOptionPossibleValues = {
  defaultOption: 'default',
  plain: 'plain',
  json: 'json',
};

const formatters = {
  [outputFormatOptionPossibleValues.defaultOption]: generateDefaultOutput,
  [outputFormatOptionPossibleValues.plain]: generatePlainFormatOutput,
  [outputFormatOptionPossibleValues.json]: generateJsonFormatOutput,
};

const generateOutput = format => formatters[format];

export default generateOutput;
export { outputFormatOptionPossibleValues };
