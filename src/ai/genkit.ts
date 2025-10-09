
/**
 * @fileoverview This file initializes the Genkit AI instance with the Google AI plugin.
 * It can be used to define models, prompts, and flows.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracing: true,
});
