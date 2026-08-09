import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendWelcomeEmail = async ({ name, email, intro }: WelcomeEmailData) => {
  const htmlTemplates = WELCOME_EMAIL_TEMPLATE.replace(
    `{{name}}`,
    name,
  ).replace(`{{intro}}`, intro);

  const message = {
    from: "Signalist <$WebWizard@gmail.com>",
    to: email,
    subject: "Welcome to Signalist - your stock market toolkit is ready!",
    text: "thanks for joining signalist",
    html: htmlTemplates,
  };

  await transporter.sendMail(message);
};