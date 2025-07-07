import { ClientSubscriptionEmailData } from '../../contants/types';
import { config } from '../../config/config';
import { EmailTemplateFooter, EmailTemplateHeader } from './components';

export const packageSubcription = (detail: ClientSubscriptionEmailData) => {
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
                    <h1 style="font-family: Inter;font-size: 16px;font-weight: 600;line-height: 24px;">Subscription Confirmation</h1>      
                </div>
                <div>
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">Hi ${detail.email}, </p>
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;" >Thank you for subscribing to Schesti! We are excited to have you on board. Your subscription details are as follows:</p>
                    
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;" >
                    Plan: ${detail.planName}
                    </p>
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;" >
                    Start Date: ${detail.startDate}
                    </p>
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;" >
                    End Date: ${detail.endDate}
                    </p>
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;" >
                    Amount: $${detail.amount}
                    </p>

                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;" >
                    If you have any questions or need further assistance, please feel free to contact our support team.
                    </p>
                    


                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">Regards,</p>
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">Schesti</p>
                </div>
            
               </div>
              
            </div>
        </main>
        
        ${EmailTemplateFooter()}
        
    </body>
    </html>
    `;
};

// export const packageSubcription = (detail: any) => {
//   return `
//       <!DOCTYPE html>
//   <html lang="en">

//   <head>
//       <meta charset="UTF-8">
//       <meta http-equiv="X-UA-Compatible" content="IE=edge">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Schesti | Welcome</title>
//       <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
//   </head>
//   <style>
//       * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           font-family: 'Inter', sans-serif;
//       }

//       .parent {
//           max-width: 680px;
//           margin: 0 auto;
//           width: 100%;
//       }
//       .email_container{
//           background-color: #F5F6F8;
//           padding: 40px;

//       }
//       .email_confirm {
//           background: white;
//           border-radius: 4px;
//           padding: 40px;
//       }
//       header{
//           background: linear-gradient(180deg, #8449EB 0%, #6A56F6 100%);
//           height: 66px;
//       }

//       .email_btn {
//           border: none;
//           background: linear-gradient(180deg, #8449EB 0%, #6A56F6 100%);
//           cursor: pointer;
//           background: -moz-linear-gradient(180deg, #8449EB 0%, #6A56F6 100%);
//           background: -webkit-linear-gradient(180deg, #8449EB 0%, #6A56F6 100%);
//       }

//       .header {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           padding: 40px;
//       }
//       .social_icons{
//          display: flex;
//          gap: 22px;
//          margin-top: 10px;
//          align-items: center;
//           }

//       .email_confirm>h2 {
//           margin-bottom: 16px;
//           color: #192A3E;
//           font-family: Inter;
//           font-size: 16px;
//           font-style: normal;
//           font-weight: 600;
//           line-height: 24px;

//       }

//       .email_confirm>p {
//           margin-bottom: 24px;
//           line-height: 150%;
//           letter-spacing: 0.2px;
//           color: #384860;
//           font-size: 16px;
//           font-style: normal;
//           font-weight: 400;
//           line-height: 24px;
//       }

//       .email_confirm>p>span {
//           font-weight: bold;
//       }

//       .email_btn {
//           color: white;
//           padding: 16px 24px;
//           border-radius: 8px;
//           width: 100%;
//           font-size: 14px;
//           font-style: normal;
//           font-weight: 600;
//           line-height: 20px;
//       }

//       .footer {
//           padding: 20px;
//           background-color: #F4EBFF;
//       }

//       .footer_bottom {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 24px;
//       }

//       .footer_bottom a {
//           font-size: 10px;
//           font-style: normal;
//           font-weight: 400;
//           line-height: 22px;
//           color: #475467;
//           text-decoration: underline;
//       }

//       .cta_heading{
//         margin-top: 20px;
//       }

//       .footer .copyright{
//           text-align: center;
//           color: #475467;
//           margin-top: 7px;
//           font-size: 10px;
//           font-style: normal;
//           font-weight: 400;
//           line-height: 22px;
//       }

//     @media (max-width:680px) {
//       .email_container{
//           padding: 30px;
//         }
//         .footer_bottom {
//             display: flex;
//             gap: 15px;
//            flex-wrap: wrap;
//             align-items: center;
//         }

//         .header {
//             height: 90px;
//         }
//     }

//     @media (max-width:680px) {
//       .email_container{
//           padding: 20px;
//         }
//     }
//   </style>

//   <body>
//       <!-- parent div -->
//       <div class="parent">
//           <!-- header -->
//           <header class="header">
//               <img  src="${config.BACKEND_URL}/images/logo.svg" alt="">
//               <div class="social_icons">
//                   <a target="_blank"  href="https://twitter.com/">
//                       <img class="social_icon" src="${config.BACKEND_URL}/images/twitter.svg" alt="twiter">
//                   </a>
//                   <a target="_blank"  href="https://www.facebook.com/">
//                       <img class="social_icon" src="${config.BACKEND_URL}/images/fb.svg" alt="facebook">
//                   </a>
//                   <a target="_blank" href="https://www.instagram.com/">
//                       <img class="social_icon" src="${config.BACKEND_URL}/images/instagram.svg" alt="instagram">
//                   </a>
//               </div>
//           </header>
//           <!-- email section -->
//   <div class="email_container">
//       <div class="email_confirm">
//           <h2>Package has been subcribed</h2>
//           <p>Hi, ${detail.email} </p>
//           <p>
//           You have subcribe this package ${detail.name}
//                 </p>

//           <p class='cta_heading' >
//           If you did not initiate this request, please ignore this message.
//                 </p>
//                 <p> Regards,<br /> <span>Schesti</span></p>

//       </div>

//       </div>
//   </div>

//   <div>

//           <!-- footer -->
//           <div class="footer">
//               <div class="footer_bottom">

//                       <a target="_blank" href="/privacy" style="text-decoration: none;">Privacy policy</a>

//                           <a target="_blank"  href="/terms" style="text-decoration: none;">Terms & conditions</a>

//               <a target="_blank" href="/cookies" style="text-decoration: none;">Cookies policy</a>
//               </div>
//               <p class="copyright">
//                   © 2023 Schesti . All rights reserved.
//                     </p>
//           </div>

//       </div>
//   </body>

//   </html>
//     `;
// };
