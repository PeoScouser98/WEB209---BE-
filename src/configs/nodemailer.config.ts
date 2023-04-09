import nodemailer from "nodemailer";
import "dotenv/config";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
	service: process.env.MAIL_SERVICE,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASSWORD,
	},
} as string | SMTPTransport | SMTPTransport.Options | undefined);

export default transporter;
