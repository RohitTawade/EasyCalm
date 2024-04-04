const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Use SSL/TLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Function to send email
const sendEmail = async (to, subject, text) => {
    try {
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: to, // sender address
            to: 'hospitalproject3@gmail.com', // list of receivers
            subject: subject, // Subject line
            text: text // plain text body
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error occurred while sending email:", error);
    }
};

module.exports = sendEmail;
