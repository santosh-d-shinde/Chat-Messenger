const crypto = require("crypto");
const User = require("../models/users");
const EmailService = require("../services/email.service");


class EmailVerification {
    static async post(request, response) {
        try {
            const { email } = request.body;

            if (!email) {
                return response.status(400).json({
                    success: false, message: "Email is required."
                });
            }

            const user = await User.findOne({ where: { email } });

            // Don't expose whether the account exists
            if (!user) {
                return response.status(200).json({
                    success: true, message: "If an account exists, a verification email has been sent."
                });
            }

            if (user.isVerified) {
                return response.status(200).json({
                    success: true, message: "Your email address has already been verified."
                });
            }

            // Secure random token (128 chars)
            const rawToken = crypto.randomBytes(64).toString("hex");

            // SHA-512 hash (128 chars)
            const hashToken = crypto
                .createHash("sha512")
                .update(rawToken)
                .digest("hex");

            await user.update({
                hashToken,
                hashTokenExpiresAt: new Date(Date.now() + 20 * 60 * 1000)
            });

            const verificationLink =
                `${process.env.FRONT_END_BASE_URL}/verify-email?token=${rawToken}`;

            await EmailService.send({
                from: process.env.SMTP_EMAIL_USER,
                to: [user.email],
                subject: "Verify your email address",
                template: "template/emails/verifyEmail.html",
                placeholders: {
                    userName: `${user.firstName} ${user.lastName}`,
                    verificationLink,
                    expiryMinutes: 20
                }
            });

            return response.status(200).json({
                success: true,
                message: "Verification email has been sent."
            });

        } catch (error) {
            console.error("Email Verification Error:", error);

            return response.status(500).json({
                success: false,
                message: "Unable to process your request."
            });
        }
    }
}

module.exports = EmailVerification;