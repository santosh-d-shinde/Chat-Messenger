require("dotenv").config();

const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.SMTP_EMAIL_USER,
        pass: process.env.SMTP_EMAIL_PASS
    }
});

class EmailService {

    static async send({
        from,
        to,
        subject,
        templatePath,
        placeholders = {}
    }) {

        let html = fs.readFileSync(
            path.resolve(templatePath),
            "utf8"
        );

        Object.keys(placeholders).forEach(key => {
            html = html.replaceAll(
                `{{${key}}}`,
                placeholders[key]
            );
        });

        await transporter.sendMail({
            from, to, subject, html
        });
    }
}

module.exports = EmailService;