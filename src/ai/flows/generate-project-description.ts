'use server';

/**
 * @fileOverview A Genkit flow for generating project descriptions using AI.
 *
 * - generateProjectDescription - A function that generates a project description based on input details.
 * - GenerateProjectDescriptionInput - The input type for the generateProjectDescription function.
 * - GenerateProjectDescriptionOutput - The return type for the generateProjectDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectDescriptionInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectDetails: z.string().describe('Detailed information about the project, including its purpose, features, and technologies used.'),
  techStack: z.string().describe('A list of technologies used in the project.'),
});

export type GenerateProjectDescriptionInput = z.infer<typeof GenerateProjectDescriptionInputSchema>;

const GenerateProjectDescriptionOutputSchema = z.object({
  projectDescription: z.string().describe('A compelling and concise description of the project.'),
});

export type GenerateProjectDescriptionOutput = z.infer<typeof GenerateProjectDescriptionOutputSchema>;

export async function generateProjectDescription(
  input: GenerateProjectDescriptionInput
): Promise<GenerateProjectDescriptionOutput> {
  return generateProjectDescriptionFlow(input);
}

const projectDescriptionPrompt = ai.definePrompt({
  name: 'projectDescriptionPrompt',
  input: {schema: GenerateProjectDescriptionInputSchema},
  output: {schema: GenerateProjectDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating engaging project descriptions for portfolios.

  Based on the project details and tech stack provided, generate a concise and compelling description of the project.

  Project Name: {{{projectName}}}
  Project Details: {{{projectDetails}}}
  Tech Stack: {{{techStack}}}

  Write a project description that highlights the project's key features, its purpose, and the technologies used.  The description should be suitable for inclusion in a portfolio.
  `,
});

const generateProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionFlow',
    inputSchema: GenerateProjectDescriptionInputSchema,
    outputSchema: GenerateProjectDescriptionOutputSchema,
  },
  async input => {
    const {output} = await projectDescriptionPrompt(input);
    return output!;
  }
);
