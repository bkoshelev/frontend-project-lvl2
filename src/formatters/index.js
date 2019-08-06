import generateJsonFormatOutput from './json';
import generatePlainFormatOutput from './plain';
import generateDefaultOutput from './default';

import { formatContent as generateOutput, addNewFormatter } from '../store';

addNewFormatter('defaultOption', generateDefaultOutput);
addNewFormatter('plain', generatePlainFormatOutput);
addNewFormatter('json', generateJsonFormatOutput);


export default generateOutput;
