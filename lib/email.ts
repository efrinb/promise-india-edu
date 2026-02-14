import nodemailer from 'nodemailer';

interface ConsultationEmailData {
  name: string;
  phone: string;
  email: string;
  city?: string;
  message?: string;
}

export async function sendConsultationNotification(
  data: ConsultationEmailData,
  adminEmail: string
) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0B3C5D; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0B3C5D; }
            .value { margin-top: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Consultation Request</h2>
              <p>Promise India Education Consultancy</p>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Phone:</div>
                <div class="value">${data.phone}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${data.email}</div>
              </div>
              ${
                data.city
                  ? `
              <div class="field">
                <div class="label">City:</div>
                <div class="value">${data.city}</div>
              </div>
              `
                  : ''
              }
              ${
                data.message
                  ? `
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${data.message}</div>
              </div>
              `
                  : ''
              }
            </div>
            <div class="footer">
              <p>This is an automated notification from Promise India Education Consultancy</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: adminEmail,
      subject: `New Consultation Request from ${data.name}`,
      html: htmlContent,
      text: `
New Consultation Request

Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email}
City: ${data.city || 'N/A'}
Message: ${data.message || 'N/A'}
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email notification');
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0B3C5D; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: #1CA7A6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank You for Your Interest!</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to Promise India Education Consultancy. We have received your consultation request and our team will get in touch with you shortly.</p>
              <p>In the meantime, feel free to explore our website to learn more about the nursing colleges and programs we offer.</p>
              <p>If you have any urgent queries, please don't hesitate to contact us.</p>
              <p>Best regards,<br>Promise India Education Consultancy Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Thank You for Your Consultation Request',
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Welcome email failed:', error);
    // Don't throw error for welcome email failure
    return { success: false };
  }
}
