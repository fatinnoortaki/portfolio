'use server';

/**
 * @fileOverview AI-powered tool to generate resume summaries (experience and education highlights).
 *
 * - generateResumeSummary - A function that handles the resume summary generation process.
 * - GenerateResumeSummaryInput - The input type for the generateResumeSummary function.
 * - GenerateResumeSummaryOutput - The return type for the generateResumeSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeSummaryInputSchema = z.object({
  experience: z
    .string()
    .describe('Description of professional experiences.'),
  education: z.string().describe('Description of educational background.'),
});
export type GenerateResumeSummaryInput = z.infer<typeof GenerateResumeSummaryInputSchema>;

const GenerateResumeSummaryOutputSchema = z.object({
  summary: z.string().describe('Concise and impactful resume summary.'),
});
export type GenerateResumeSummaryOutput = z.infer<typeof GenerateResumeSummaryOutputSchema>;

export async function generateResumeSummary(input: GenerateResumeSummaryInput): Promise<GenerateResumeSummaryOutput> {
  return generateResumeSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeSummaryPrompt',
  input: {schema: GenerateResumeSummaryInputSchema},
  output: {schema: GenerateResumeSummaryOutputSchema},
  prompt: `You are an expert resume writer. Please create a concise and impactful resume summary based on the experience and education provided.

Experience: {{{experience}}}
Education: {{{education}}}

Summary: `,
});

const generateResumeSummaryFlow = ai.defineFlow(
  {
    name: 'generateResumeSummaryFlow',
    inputSchema: GenerateResumeSummaryInputSchema,
    outputSchema: GenerateResumeSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
