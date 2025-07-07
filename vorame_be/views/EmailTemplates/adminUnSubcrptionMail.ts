import { config } from '../../config/config';

export const adminPackageUnSubcription = (detail: any) => {
  return `
      <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Schesti | Welcome</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <style>
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
      }
  
      .parent {
          max-width: 680px;
          margin: 0 auto;
          width: 100%;
      }
      .email_container{
          background-color: #F5F6F8;
          padding: 40px;
  
      }
      .email_confirm {
          background: white;
          border-radius: 4px;
          padding: 40px;
      }
      header{
          background: linear-gradient(180deg, #8449EB 0%, #6A56F6 100%);
          height: 66px;
      }
  
      .email_btn {
          border: none;
          background: linear-gradient(180deg, #8449EB 0%, #6A56F6 100%);
          cursor: pointer;
          background: -moz-linear-gradient(180deg, #8449EB 0%, #6A56F6 100%);
          background: -webkit-linear-gradient(180deg, #8449EB 0%, #6A56F6 100%);
      }
  
      .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 40px;
      }
      .social_icons{
         display: flex;
         gap: 22px;
         margin-top: 10px;
         align-items: center;
          }
     
  
      .email_confirm>h2 {
          margin-bottom: 16px;
          color: #192A3E;
          font-family: Inter;
          font-size: 16px;
          font-style: normal;
          font-weight: 600;
          line-height: 24px;
  
      }
  
      .email_confirm>p {
          margin-bottom: 24px;
          line-height: 150%;
          letter-spacing: 0.2px;
          color: #384860;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px;
      }
  
      .email_confirm>p>span {
          font-weight: bold;
      }
  
      .email_btn {
          color: white;
          padding: 16px 24px;
          border-radius: 8px;
          width: 100%;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 20px;
      }
  
      .footer {
          padding: 20px;
          background-color: #F4EBFF;
      }
  
      .footer_bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
      }
  
      .footer_bottom a {
          font-size: 10px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px;
          color: #475467;
          text-decoration: underline;
      }

      .cta_heading{
        margin-top: 20px;
      }
  
     
      .footer .copyright{
          text-align: center;
          color: #475467;
          margin-top: 7px;
          font-size: 10px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px;
      }
  
    @media (max-width:680px) {
      .email_container{
          padding: 30px;
        }
        .footer_bottom {
            display: flex;
            gap: 15px;
           flex-wrap: wrap;
            align-items: center;
        }
  
        .header {
            height: 90px;
        }
    }
  
    @media (max-width:680px) {
      .email_container{
          padding: 20px;
        }
    }
  </style>
  
  <body>
      <!-- parent div -->
      <div class="parent">
          <!-- header -->
          <header class="header">
              <img  src="${config.BACKEND_URL}/images/logo.svg" alt="">
              <div class="social_icons">
                  <a target="_blank"  href="https://twitter.com/">
                      <img class="social_icon" src="${config.BACKEND_URL}/images/twitter.svg" alt="twiter">
                  </a>
                  <a target="_blank"  href="https://www.facebook.com/">
                      <img class="social_icon" src="${config.BACKEND_URL}/images/fb.svg" alt="facebook">
                  </a>
                  <a target="_blank" href="https://www.instagram.com/">
                      <img class="social_icon" src="${config.BACKEND_URL}/images/instagram.svg" alt="instagram">
                  </a>
              </div>
          </header>
          <!-- email section -->
  <div class="email_container">
      <div class="email_confirm">
          <h2>User has unsubcribed the package</h2>
          <p> ${detail.email} has unsubcribed the package ${detail.name}  </p>
        
        
                <p> Regards,<br /> <span>Schesti</span></p>
        
      </div>
 
      </div>
  </div>

  <div>

          
          <!-- footer -->
          <div class="footer">
              <div class="footer_bottom">
                  
                      <a target="_blank" href="/privacy" style="text-decoration: none;">Privacy policy</a>
                     
                          <a target="_blank"  href="/terms" style="text-decoration: none;">Terms & conditions</a>
  
              <a target="_blank" href="/cookies" style="text-decoration: none;">Cookies policy</a> 
              </div>
              <p class="copyright">
                  © 2023 Schesti . All rights reserved.
                    </p>
          </div>
  
      </div>
  </body>
  
  </html>
    `;
};
