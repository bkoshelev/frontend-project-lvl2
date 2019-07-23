import generateJsonFormatOutput from "./json";
import generatePlainFormatOutput from "./plain";
import generateDefaultOutput from "./default";

const formatters = {
  json: generateJsonFormatOutput,
  plain: generatePlainFormatOutput,
  default: generateDefaultOutput
};

const generateOutput = format => formatters[format];

export default generateOutput;
