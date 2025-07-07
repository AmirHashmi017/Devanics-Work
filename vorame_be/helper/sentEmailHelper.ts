import { render } from '@react-email/render';
import mailNotification from './SESMail';
import { config } from '../config/config';

export const sentemailHelper = async (
  emailMembers,
  template,
  subject: string
) => {
  // try {
  //   const emailHtml = render(template);
  //   await mailNotification.sendMail({
  //     to: emailMembers,
  //     subject: 'Project Invitation',
  //     html: emailHtml,
  //   });
  //   // res.send("Email sent successfully");
  // } catch (error) {
  //   console.log('error', error);
  //   // res.send("An error occured while sending email")
  // }
  try {
    console.log('Called inside sentEmailHelper');
    const emailHtml = render(template);
    await mailNotification.sendMail({
      to: emailMembers,
      subject: subject,
      html: emailHtml,
      from: "",
    });
    console.log('email sent', emailMembers);
    // res.send("Email sent successfully");
  } catch (error) {
    console.log('error', error);
    // res.send("An error occured while sending email")
  }
};
