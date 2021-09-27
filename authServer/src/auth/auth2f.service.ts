import { Injectable } from '@nestjs/common';

const nodemailer = require("nodemailer");
const passGenerator = require('generate-password');
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: Number(process.env.SMTP_SECRURE_PORT),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASS,
    },
});


@Injectable()
export class Auth2fService {
    async send2F(email: string): Promise<string>{
        const password = await passGenerator.generate({
            length: 6,
            numbers: true,
            uppercase: true
        });

        transporter.sendMail({
            from: process.env.EMAIL_SENDER,     // sender address
            to: email,                          // list of receivers
            subject: 'Authorization',           // Subject line
            text: `Dear user - this is your password for authorization: ${password}`,
        });
        return password;
    }
}
