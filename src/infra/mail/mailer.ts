import { Resend } from 'resend';
import { env } from '@config/env';

const resend = new Resend(env.RESEND_API_KEY);
const resendForm = env.RESEND_FORM;

export async function sendMail(otps: { to: string | string[], subject: string, text: string, html: string }) {
    try {
        const to = Array.isArray(otps.to) ? otps.to : [otps.to];

        const { data, error } = await resend.emails.send({
            from: resendForm,
            to: to,
            subject: otps.subject,
            html: otps.html,
        });

        if (error) {
            console.error('Resend Email Error:', error);
            throw new Error(`Failed to send email to ${otps.to}: ${error.message}`);
        }

        console.log(`Email successfully queued for ${otps.to}. Resend ID: ${data?.id}`);
        return data;
    } catch (error) {
        console.error('General Email Sending Exception:', error);
        throw error;
    }
}
