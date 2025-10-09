
'use server';
/**
 * @fileOverview A flow for saving a contact message.
 * Note: The Firestore database integration is temporarily removed to resolve a build issue.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ContactMessageSchema = z.object({
  name: z.string().describe('The name of the person sending the message.'),
  email: z.string().email().describe('The email of the person.'),
  message: z.string().describe('The content of the message.'),
});

type ContactMessage = z.infer<typeof ContactMessageSchema>;

// This flow temporarily returns a success message without saving to a database.
export const saveContactMessageFlow = ai.defineFlow(
  {
    name: 'saveContactMessageFlow',
    inputSchema: ContactMessageSchema,
    outputSchema: z.string(),
  },
  async (messageData) => {
    // In a real app, you would save this data to a database.
    // The original implementation used Firestore, but has been temporarily
    // disabled due to a persistent build error with the Genkit Firebase plugin.
    console.log('Received contact message:', messageData);

    return `Message from ${messageData.name} received.`;
  }
);

// Export a wrapper function to be called from server actions.
export async function saveContactMessage(
  input: ContactMessage
): Promise<string> {
  return await saveContactMessageFlow(input);
}
