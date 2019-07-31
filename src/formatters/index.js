import generateJsonFormatOutput from './json';
import generatePlainFormatOutput from './plain';
import generateDefaultOutput from './default';

import { formatContent as generateOutput, getFormattersName, addNewFormatter } from '../store';

addNewFormatter('defaultOption', generateDefaultOutput);
addNewFormatter('plain', generatePlainFormatOutput);
addNewFormatter('json', generateJsonFormatOutput);

const outputFormatOptionPossibleValues = getFormattersName();

export { outputFormatOptionPossibleValues };
export default generateOutput;
