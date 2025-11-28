import React from 'react';
import { EMAIL_TEMPLATE_ASSETS } from 'src/constants/links.constants';

export function EmailHeader() {
  const FRONTEND_LINKS = {
    SCHESTI_HOME: '/home', // Replace with the actual link
    TWITTER_LINK: 'https://x.com/schestitech?s=21',
    FACEBOOK_LINK:
      'https://www.facebook.com/people/Schesti-Technologies/61563918897388/?mibextid=kFxxJD&rdid=DE1M3ERYzkc3fefQ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F65Z2ZQLrnZSKh4Eb%2F%3Fmibextid%3DkFxxJD', // Replace with the actual link
    LINKEDIN_LINK:
      'https://www.linkedin.com/posts/schesti_schesti-constructionmanagement-projectmanagement-activity-7240798897957150720-G07_/',
    INSTAGRAM_LINK:
      'https://www.instagram.com/schesti.technologies/?igsh=MW5zOGRqZW0xMWFhMg%3D%3D',
  };

  return (
    <div className="bg-[#007AB6] w-full rounded py-5 px-12">
      <div className="flex justify-between items-center">
        <a href={process.env.REACT_APP_SCHESTI_BASE_URL}>
          <img src={EMAIL_TEMPLATE_ASSETS.LOGO} alt="Logo" className="w-16" />
        </a>
        <div className="flex items-center space-x-2">
          <a href={FRONTEND_LINKS.TWITTER_LINK} className="inline-block">
            <img
              src="https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/slack-twitter.png"
              alt="Twitter"
              className="w-8"
            />
          </a>
          <a href={FRONTEND_LINKS.FACEBOOK_LINK} className="inline-block">
            <img
              src="https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/slack-facebook.png"
              alt="Facebook"
              className="w-8"
            />
          </a>
          <a href={FRONTEND_LINKS.LINKEDIN_LINK} className="inline-block">
            <img
              src="https://react-email-demo-jsqyb0z9w-resend.vercel.app/static/slack-linkedin.png"
              alt="LinkedIn"
              className="w-8"
            />
          </a>
          <a href={FRONTEND_LINKS.INSTAGRAM_LINK} className="inline-block">
            <img
              src={`https://static.vecteezy.com/system/resources/previews/042/127/160/large_2x/instagram-logo-on-circle-style-with-transparent-background-free-png.png`}
              alt="Instagram"
              // className="w-8 h-8"
              width={36}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
