const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS // Your email password or app-specific password
  }
});

// Function to send email
const sendEmail = (to, subject, text) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER, // Sender address
    to,
    subject,
    text
  });
};

module.exports = sendEmail;
