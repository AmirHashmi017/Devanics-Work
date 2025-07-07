const mailjet = require('node-mailjet').apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

export const sendMailJet = async () => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'info@mohammadmohammad.com',
          Name: 'Schesti',
        },
        To: [
          {
            Email: 'chazher2020@gmail.com',
            Name: 'Azher Saeed',
          },
        ],
        Subject: 'Test Email from Mailjet and Node.js',
        // TemplateID: templateId,
        Variables: {
          //variables you want to use in your templete
          name: 'test',
        },
        TemplateLanguage: true,
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.error(err.statusCode, err.message);
    });
};
