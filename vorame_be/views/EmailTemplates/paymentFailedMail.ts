import { config } from '../../config/config';
import { PaymentFailedEmailData } from '../../contants/types';
import { EmailTemplateFooter, EmailTemplateHeader } from './components';

export const paymentFailedTemplate = (details: PaymentFailedEmailData) => {
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
                    <h1 style="font-family: Inter;font-size: 16px;font-weight: 600;line-height: 24px;">Payment Failure</h1>      
                </div>
                <div>
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">Hi ${details.email}, </p>
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;" > We were unable to process your recent payment for your Schesti subscription. Please update your payment information or try again. If you need assistance, contact our support team.</p>
                   
                    
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">Regards,</p>
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">Schesti</p>
                    <p style="font-family: Inter;font-size: 16px; font-weight: 400;line-height: 24px;">support@schesti.com</p>
                </div>
            
               </div>
              
            </div>
        </main>
       

        ${EmailTemplateFooter()}
        
    </body>
    </html>
    `;
};
