export interface SendMailOptions {
  to: string;
  name?: string;
  subject: string;
  html: string;
}

export async function sendBrevoMail({ to, name, subject, html }: SendMailOptions) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.BREVO_FROM_EMAIL?.trim();
  const fromName = process.env.BREVO_FROM_NAME?.trim() || 'Lumana AutoPlanet';

  if (!apiKey || !fromEmail) {
    console.warn('Brevo email not configured. Skipping email send.');
    return { ok: false, skipped: true };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ email: to, name: name || to }],
        subject,
        htmlContent: html,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Brevo email send failed:', response.status, text);
      return { ok: false, skipped: false, status: response.status, error: text };
    }

    return { ok: true, skipped: false };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Brevo email send timed out after 8s.');
      return { ok: false, skipped: false, error: 'timeout' };
    }

    console.error('Brevo email send threw:', error);
    return { ok: false, skipped: false, error: String(error) };
  } finally {
    clearTimeout(timeout);
  }
}
