const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create reusable transporter object using default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL, // Your Gmail address
      pass: process.env.SMTP_PASSWORD // Your Gmail App Password
    }
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
