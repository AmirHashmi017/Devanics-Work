import { config } from '../config/config';

const nodemailer = require('nodemailer');

export const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: config.MAILHOST,
      port: config.MAILPORT,
      auth: {
        user: config.MAILUSER,
        pass: config.MAILPASS,
      },
    });
    await transporter.sendMail({
      from: config.SENDEREMAIL,
      to: email,
      subject: subject,
      html: text,
    });

    return true;
  } catch (error) {
    console.log('Mail Error', error);

    return false;
  }
};

export const sendEmailToClient = async (
  subject: string,
  text: string,
  recievingEmail = ""
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: "",
        pass: "",
      },
    });
    await transporter.sendMail({
      from: "",
      to: recievingEmail,
      subject: subject,
      html: text,
    });

    return true;
  } catch (error) {
    console.log('Contact Mail Error', error);

    return false;
  }
};
