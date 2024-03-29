
const nodemailer = require('nodemailer')
const useremail = process.env.USER_EMAIL
const password = process.env.USER_PASSWORD

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: useremail,
        pass: password,
    }
})

function sendEmail(toEmail, subject, html) {
    const mailOptions = {
        from: useremail,
        to: toEmail,
        subject: subject,
        html: html,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(error);
            } else {
                console.log('Email sent:', info.response);
                resolve(info);
            }
        });
    });
}

module.exports = { sendEmail };