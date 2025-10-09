
'use server';
/**
 * @fileOverview A flow for saving a contact message to Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { firebase, getFirebaseApp } from '@genkit-ai/google-genai/firebase';
import { getFirestore } from 'firebase-admin/firestore';

const ContactMessageSchema = z.object({
  name: z.string().describe('The name of the person sending the message.'),
  email: z.string().email().describe('The email of the person.'),
  message: z.string().describe('The content of the message.'),
});

type ContactMessage = z.infer<typeof ContactMessageSchema>;

// This flow saves the contact message to a Firestore collection.
export const saveContactMessageFlow = ai.defineFlow(
  {
    name: 'saveContactMessageFlow',
    inputSchema: ContactMessageSchema,
    outputSchema: z.string(),
  },
  async (messageData) => {
    // This flow is configured to use Firebase.
    // Before running this flow, you must configure Firebase by running:
    // `genkit firebase:config`
    await firebase.assertConfig();

    const db = getFirestore(getFirebaseApp());
    const collection = db.collection('contact-messages');
    const doc = await collection.add({
      ...messageData,
      sentAt: new Date().toISOString(),
    });

    return `Message saved with ID: ${doc.id}`;
  }
);

// Export a wrapper function to be called from server actions.
export async function saveContactMessage(
  input: ContactMessage
): Promise<string> {
  return await saveContactMessageFlow(input);
}
