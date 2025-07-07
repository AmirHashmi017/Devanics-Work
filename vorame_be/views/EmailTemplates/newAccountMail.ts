import { NewAccountEmailData } from "contants/types";
import { config } from "../../config/config";
import { EmailTemplateFooter, EmailTemplateHeader } from "./components";

export const newAccountTemplete2 = (detail: NewAccountEmailData) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
      </style>
  <body>
    ${EmailTemplateHeader()}  

      <main>
          <div style="height: 575px; padding: 27px 48px 50px 48px;background-color: rgba(255, 255, 255, 1);">
             <div style="padding: 40px 40px 214px 40px;">
              <div style="display: flex;flex-direction: column;gap: 18px;">
                  <h1 style="font-family: Inter;font-size: 16px;font-weight: 600;line-height: 24px;">Verify Your Vor Amé Account</h1>      
              </div>
              <div>
                  <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">Hi ${detail.name},</p>
                  
                  <!-- Codition for register if otp is not null and exists then show otp other wise show verify email button (on singup showing otp on login and other steps showing verify email button) -->
                  ${
                    detail.otp
                      ? `<p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;" >Thank you for signing up with us. We need one more quick step to complete the process: Please confirm your email address by enter OTP below.</p>
                         <h1 style="font-family: Inter;font-size: 16px;font-weight: 600;line-height: 24px;"> ${detail.otp} </h1>`
                      : `
                      <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;" >Thank you for signing up with us. We need one more quick step to complete the process: Please confirm your email address by click on button below.</p>
                      <a target="_blank"  href="${detail.redirectLink}">
                        <button style="width:fit-content;height:40px;padding: 10px 16px 10px 16px;display: flex;justify-content: center;border-radius: 8px;border: 1px;background: rgba(127, 86, 217, 1);">
                          <span style="font-family: Inter;font-size: 14px;font-weight: 600;line-height: 20px; color: rgba(255, 255, 255, 1);">Verify Email</span>
                        </button>
                      </a>`
                  }   
                    
                  <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;" >If you did not create an account, please ignore this email.</p>
                  
                  <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">Regards,</p>
                  <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">Vor Amé</p>
                  <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">support@vorame.com</p>
              </div>
             </div>
            
          </div>
      </main>
     
      ${EmailTemplateFooter()}
      
  </body>
  </html>
  `;
};

export const newAccountTemplete = (detail: any) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1, width=device-width" />
    
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f5f6f8;">
      <!-- Header Section -->
      <tr style=" background: linear-gradient(180deg, #8449eb, #6a56f6);" >
      <td style="padding: 20px; text-align: left;">
        <img src=${config.SCHESTI_LOGO} alt="Vor Amé logo" >
      </td>
      <td style="padding: 20px; text-align: right;">
        <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block;">
          <tr>
            <td style="padding: 0 5px;">
            <a target="_blank"  href="https://www.facebook.com/">
              <img src=${config.FACEBOOK_LOGO} alt="instagram logo" >
              </a>
            </td>
            <td style="padding: 0 5px;">
            <a target="_blank"  href="https://twitter.com/">
              <img src=${config.TWITTER_LOGO} alt="instagram logo" >
              </a>
            </td>
           
            <td style="padding: 0 5px;">
            <a target="_blank" href="https://www.instagram.com/">
              <img src=${config.INSTAGRAM_LOGO} alt="instagram logo" >
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
      <!-- Body Section -->
      <tr>
        <td style="padding: 20px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color: #fff; border-radius: 4px; width:100%;">
            <tr>
              <td style="padding: 40px; color: #192a3e; font-size: 16px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                  <tr>
                    <td style="font-weight: 600; line-height: 24px; padding-bottom: 18px;">Confirm your email address</td>
                  </tr>
                  <tr>
                    <td style="color: #667085; line-height: 24px;">
                      <p>Hi (Company name),</p>
                      <p>&nbsp;</p>
                      <p>Thank you for signing up with us. We need one more quick step to complete the process: Please confirm your email address by clicking the button below.</p>
                      <p>&nbsp;</p>
                      <p>Regards,</p>
                      <p>Vor Amé</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td style="background-color: #7e56d9; border-radius: 8px;">
                            <a href="#" style="display: inline-block; padding: 10px 16px; color: #fff; text-decoration: none; font-size: 14px; font-weight: 600;">Okay!</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer Section -->
      <tr style="background-color: #F4EBFF; width:100%;" width="100%">
        <td style="padding: 20px; text-align: center; color: #475467;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="font-size: 10px;">Cookies policy</td>
              <td style="font-size: 10px;">Privacy policy</td>
              <td style="font-size: 10px;">Terms &amp; conditions</td>
            </tr>
            <tr>
              <td colspan="3" style="font-size: 10px;">© 2023 Vor Amé . All rights reserved.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
