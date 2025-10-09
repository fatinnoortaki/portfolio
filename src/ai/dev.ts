
/**
 * @fileoverview This file is used to start the Genkit developer server.
 * It imports the flows from the flows directory and starts the server.
 */

import { start } from 'genkit';
import * as path from 'path';

const flowsPath = path.resolve(__dirname, 'flows');

start({ flows: { directory: flowsPath } });
