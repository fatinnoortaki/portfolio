
'use server';
/**
 * @fileOverview A flow for sending a contact message via email using nodemailer.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as nodemailer from 'nodemailer';
import { portfolioData } from '@/lib/data';

const ContactMessageSchema = z.object({
  name: z.string().describe('The name of the person sending the message.'),
  email: z.string().email().describe('The email of the person.'),
  message: z.string().describe('The content of the message.'),
});

type ContactMessage = z.infer<typeof ContactMessageSchema>;

// This flow sends an email with the contact form data.
export const sendContactEmailFlow = ai.defineFlow(
  {
    name: 'sendContactEmailFlow',
    inputSchema: ContactMessageSchema,
    outputSchema: z.string(),
  },
  async (messageData) => {
    const { name, email, message } = messageData;

    // Create a transporter object using SMTP transport.
    // The credentials and server info are pulled from environment variables.
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // Enforce secure connection for port 465
      auth: {
        user: process.env.SMTP_USERNAME, // The username for SMTP authentication (e.g., from MailerSend)
        pass: process.env.EMAIL_SERVER_PASS, // The password for SMTP authentication
      },
    });

    // Set up email data
    const mailOptions = {
      from: `"${portfolioData.name}" <${process.env.EMAIL_FROM}>`, // The "From" address (verified with your email service)
      to: process.env.EMAIL_TO, // The address to receive the notification
      subject: `New Contact Form Message from ${name}`, // Subject line
      text: message, // plain text body
      html: `
        <h1>New Message from your Portfolio Contact Form</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      replyTo: email, // Set the sender's email as the reply-to address
    };

    try {
      // Send mail with defined transport object
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return `Message sent successfully to ${process.env.EMAIL_TO}.`;
    } catch (error) {
      console.error('Error sending email:', error);
      // Throwing an error will cause the calling action to fail,
      // which is what we want to show an error message to the user.
      throw new Error('Failed to send email.');
    }
  }
);

// Export a wrapper function to be called from server actions.
export async function saveContactMessage(
  input: ContactMessage
): Promise<string> {
  return await sendContactEmailFlow(input);
}
