
'use server';
/**
 * @fileOverview A flow for sending a contact message via email using nodemailer.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as nodemailer from 'nodemailer';

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
    const emailServerPort = Number(process.env.EMAIL_SERVER_PORT || 587);

    // Create a transporter object using SMTP transport.
    // The credentials and server info are pulled from environment variables.
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: emailServerPort,
      secure: emailServerPort === 465, // `secure:true` for port 465, `secure:false` for all other ports
      auth: {
        user: process.env.SMTP_USERNAME, // The username for SMTP authentication (e.g., from MailerSend)
        pass: process.env.EMAIL_SERVER_PASS, // The password or API token for SMTP authentication
      },
    });

    // Set up email data
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_FROM}>`, // The "From" address (verified with your email service)
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
    } catch (error: any) {
      // Log the full error for better debugging
      console.error('Failed to send email. Full error: ', error);
      
      // Provide a more specific error message back to the action
      let errorMessage = 'Failed to send email. Please check the server logs for more details.';
      if (error.code === 'EAUTH') {
        errorMessage = 'Authentication error. Please check your SMTP username and password in the .env file.';
      } else if (error.responseCode === 535) {
        errorMessage = 'Authentication failed (Error 535). This could be a wrong password or an unverified "From" email address.';
      }
      
      throw new Error(errorMessage);
    }
  }
);

// Export a wrapper function to be called from server actions.
export async function saveContactMessage(
  input: ContactMessage
): Promise<string> {
  return await sendContactEmailFlow(input);
}
