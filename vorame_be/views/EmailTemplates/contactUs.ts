import { EmailTemplateFooter, EmailTemplateHeader } from "./components";

export const contactUsTemplate = (detail: any) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Us Inquiry</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:wght@100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap');
        </style>
    </head>
    <body>
      ${EmailTemplateHeader()}

      <main>
        <div style="padding: 40px; background-color: #fff;">
          <div style="max-width: 600px; margin: auto;">
            <h1 style="font-family: Inter, sans-serif; font-size: 20px; font-weight: 600;">New Contact Us Inquiry</h1>
            
            <p style="font-family: Inter, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
              Hello Admin,
            </p>

            <p style="font-family: Inter, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
              You have received a new inquiry through the Contact Us form. Here are the details:
            </p>

            <div style="font-family: Inter, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
              <p><strong>Name:</strong> ${detail.name}</p>
              <p><strong>Email:</strong> ${detail.email}</p>
              <p><strong>Subject:</strong> ${detail.subject}</p>
              <p><strong>Message:</strong> ${detail.message}</p>
            </div>

            <p style="font-family: Inter, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">
              Please respond to the user at your earliest convenience.
            </p>
            
            <p style="font-family: Inter, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">Regards,</p>
            <p style="font-family: Inter, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px;">Vorame</p>
          </div>
        </div>
      </main>

      ${EmailTemplateFooter()}
    </body>
    </html>
  `;
};
