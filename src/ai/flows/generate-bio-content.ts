'use server';

/**
 * @fileOverview AI-powered tool to generate suggested content for the bio in the 'About' section.
 *
 * - generateBioContent - A function that handles the generation of bio content.
 * - GenerateBioContentInput - The input type for the generateBioContent function.
 * - GenerateBioContentOutput - The return type for the generateBioContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBioContentInputSchema = z.object({
  userInput: z.string().describe('User input describing their background and experience.'),
});
export type GenerateBioContentInput = z.infer<typeof GenerateBioContentInputSchema>;

const GenerateBioContentOutputSchema = z.object({
  suggestedBio: z.string().describe('AI-generated suggested bio content based on user input.'),
});
export type GenerateBioContentOutput = z.infer<typeof GenerateBioContentOutputSchema>;

export async function generateBioContent(input: GenerateBioContentInput): Promise<GenerateBioContentOutput> {
  return generateBioContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBioContentPrompt',
  input: {schema: GenerateBioContentInputSchema},
  output: {schema: GenerateBioContentOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are a professional bio writer. Based on the user input, generate engaging and informative bio content.

User Input: {{{userInput}}}

Suggested Bio Content: `,
});

const generateBioContentFlow = ai.defineFlow(
  {
    name: 'generateBioContentFlow',
    inputSchema: GenerateBioContentInputSchema,
    outputSchema: GenerateBioContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
