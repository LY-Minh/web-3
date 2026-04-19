import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",  // Mailtrap SMTP host
      port: 587,                        // Mailtrap SMTP port
      auth: {
        user: process.env.MAILTRAP_USER, // SMTP username from .env.local
        pass: process.env.MAILTRAP_PASS  // SMTP password from .env.local
      }
    });

export default transporter;