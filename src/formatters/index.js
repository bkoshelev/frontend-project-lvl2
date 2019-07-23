import generateJsonFormatOutput from "./json";
import generatePlainFormatOutput from "./plain";

const formatters = {
  json: generateJsonFormatOutput,
  plain: generatePlainFormatOutput
};

const generateOutput = format => formatters[format];

export default generateOutput;
