import { config } from '../config/config';

export const FRONTEND_LINKS = {
  BID_MANAGEMENT_PROJECTS: config.FRONTEND_URL + '/bid-management/contractor',
  Bid_Management_Project_Details:
    config.FRONTEND_URL + '/bid-management/details/',
  SCHESTI_HOME: config.FRONTEND_URL,
  ADD_PROJECT_TO_FAVOURITE: config.FRONTEND_URL + '/bid-management/favourite',
  SCHESTI_DASHBOARD: config.FRONTEND_URL + '/dashboard',
  SCHESTI_PRIVACY_POLICY: config.FRONTEND_URL + '/privacy',
  SCHESTI_CONTACT_US: config.FRONTEND_URL + '/contact',
  SCHESTI_TERMS: config.FRONTEND_URL + '/terms-conditions',
  SCHEST_COOKIES: config.FRONTEND_URL + '/cookies',
};

export const EMAIL_TEMPLATE_ASSETS = {
  BELL: 'https://schesti-dev.s3.eu-north-1.amazonaws.com/email-assests/bell.png',
  CALENDER:
    'https://schesti-dev.s3.eu-north-1.amazonaws.com/email-assests/calender.png',
  DOCUMENT:
    'https://schesti-dev.s3.eu-north-1.amazonaws.com/email-assests/document.png',
  FILE_DOCUMENT:
    'https://schesti-dev.s3.eu-north-1.amazonaws.com/email-assests/file_document.png',
  FOOTER:
    'https://schesti-dev.s3.eu-north-1.amazonaws.com/email-assests/footer.png',
  LOGO_CYAN:
    'https://schesti-dev.s3.eu-north-1.amazonaws.com/email-assests/logo_cyan.png',
  LOGO: 'https://schesti-dev.s3.eu-north-1.amazonaws.com/email-assests/logo.png',
};
