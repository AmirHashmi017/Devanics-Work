import ICompany from 'modules/user/interfaces/user.interface';
import { config } from '../../config/config';

export const newEmployeeTemplete = (
  newUser: ICompany,
  existingUser: ICompany,
  password: string
) => {
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
        <img src=${config.SCHESTI_LOGO} alt="schesti logo" >
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
                    <td style="font-weight: 600; line-height: 24px; padding-bottom: 18px;">Invitation as Employee</td>
                  </tr>
                  <tr>
                    <td style="color: #667085; line-height: 24px;">
                      <p>Hi ${newUser.lastName}</p>
                      <p>&nbsp;</p>
                      <p>${existingUser.name} has added you as an employee.</p>
                      <p>Your Email: ${newUser.email}</p>
                      <p>Your Password: ${password}</p>
                      <p>Use this credentials to login.</p>
                      <p>&nbsp;</p>
                      <p>Regards,</p>
                      <p>Schesti</p>
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
              <td colspan="3" style="font-size: 10px;">© 2023 Schesti . All rights reserved.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
