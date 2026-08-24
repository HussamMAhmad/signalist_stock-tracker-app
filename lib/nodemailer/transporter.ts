import nodemailer from "nodemailer";
import {
  WELCOME_EMAIL_TEMPLATE,
  NEWS_SUMMARY_EMAIL_TEMPLATE,
} from "./templates";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendWelcomeEmail = async ({
  name,
  email,
  intro,
}: WelcomeEmailData) => {
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

export const sendNews = async ({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}): Promise<void> => {
  const htmlTemplates = NEWS_SUMMARY_EMAIL_TEMPLATE.replace(
    `{{date}}`,
    date,
  ).replace(`{{newsContent}}`, newsContent);

  const message = {
    from: `"Signalist News" <signalist$WebWizard@gmail.com>`,
    to: email,
    subject: `Market News Summery Today - ${date}`,
    text: "Today's market news summery from Signalist",
    html: htmlTemplates,
  };

  await transporter.sendMail(message);
};
