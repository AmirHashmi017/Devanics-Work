import nodemailer, { Transporter } from "nodemailer";
import AWS, { SES, SNS } from "aws-sdk";
import { EHttpStatus } from "../enums/httpStatus.enum";
import { ResponseMessage } from "../enums/resMessage.enum";
import { CustomError } from "../errors/custom.error";
const fs = require("fs");

const ses = new AWS.SES({
  accessKeyId: process.env.MAIL_ACCESS_KEY!,
  secretAccessKey: process.env.MAIL_SECRET_ACCESS_KEY!,
  region: process.env.MAIL_REGION!,
});

class Notify {
  private mailer: Transporter;
  private getSMSContent(otp: string): string {
    return `Your OTP is ${otp}. It will expire in 5 minutes. Please do not share it with anyone.`;
  }

  constructor() {
    AWS.config.update({
      apiVersion: "latest",
      credentials: {
        accessKeyId: process.env.MAIL_ACCESS_KEY!,
        secretAccessKey: process.env.MAIL_SECRET_ACCESS_KEY!,
      },
      region: process.env.MAIL_REGION!,
    });
    this.mailer = nodemailer.createTransport({
      // SES: new SES({ region: process.env.MAIL_REGION! }),
      // port: 443,
      // sendingRate: 1,
      SES: new AWS.SES(),
    });
  }

  async sendMail(mailOptions: nodemailer.SendMailOptions) {
    const options = { from: process.env.EMAIL_FROM, ...mailOptions };
    try {
      const info = await this.mailer.sendMail(options);
      console.info("Mail sent successfully", info.messageId, info.response);
    } catch (error) {
      console.warn(
        "Failed to send mail！",
        error instanceof Error ? error.message : error
      );
    }
  }

  async sendMails(mailOptions: nodemailer.SendMailOptions) {
    const options = Object.assign(mailOptions, {
      from: process.env.EMAIL_FROM,
    });
    this.mailer.sendMail(options, (error, info) => {
      if (error) {
        console.warn("Failed to send mail！", error?.message || error);
      } else {
        console.info("Mail sent successfully", info.messageId, info.response);
      }
    });
  }

  async sendSms(req) {
    const { otp, phone } = req;
    // console.log(process.env.MAIL_ACCESS_KEY, process.env.MAIL_SECRET_ACCESS_KEY)
    const sns = new SNS({ apiVersion: "latest" });
    let smsOptions = {
      Message: this.getSMSContent(otp),
      PhoneNumber: phone,
    };

    try {
      await sns.publish(smsOptions).promise();

      return {
        statusCode: EHttpStatus.OK,
        message: ResponseMessage.SMS_SENT_SUCCESSFULLY,
      };
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw new CustomError(
        EHttpStatus.INTERNAL_SERVER_ERROR,
        ResponseMessage.SMS_SEND_FAILURE
      );
    }
  }

  async sendTempEmail() {
    // var params = {
    //   Destination: {
    //     ToAddresses: ['chazher2020@gmail.com'],
    //   },
    //   Message: {
    //     /* required */
    //     Body: {
    //       /* required */
    //       Html: {
    //         Charset: 'UTF-8',
    //         Data: emailTemplate,
    //       },
    //       Text: {
    //         Charset: 'UTF-8',
    //         Data: 'TEXT_FORMAT_BODY',
    //       },
    //     },
    //     Subject: {
    //       Charset: 'UTF-8',
    //       Data: 'Test email',
    //     },
    //   },
    //   Source: 'noreply@schesti.com',
    // };
    // const params = {
    //   Destination: {
    //     ToAddresses: ['chazher2020@gmail.com'] // Add your recipient's email address here
    //   },
    //   Message: {
    //     Body: {
    //       Html: {
    //         Charset: 'UTF-8',
    //         Data:  EMails['REGISTER_USER']({
    //           name : 'Azher',
    //           email : 'chqzher'
    //         })
    //       }
    //     },
    //     Subject: {
    //       Charset: 'UTF-8',
    //       Data: 'Test Email with Images' // Your email subject
    //     }
    //   },
    //   Source: 'noreply@schesti.com' // Sender's email address
    // };
    // try {
    //   // Send email using SES
    //   const data = await ses.sendEmail({}).promise();
    //   console.log('Email sent successfully:', data.MessageId);
    // } catch (error) {
    //   console.error('Error sending email:', error);
    // }
  }
}

export default new Notify();
