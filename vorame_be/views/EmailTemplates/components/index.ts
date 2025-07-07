import { config } from '../../../config/config';

export function EmailTemplateFooter() {
  return `
    <footer>
    <div style="background-color:rgba(244, 235, 255, 1);">
        <div>
        <div style="text-align: center;">
<div style="display: inline-flex; justify-content: center; gap: 24px;">
  <p style="font-family: Inter; font-size: 10px; font-weight: 400; line-height: 22px; color: rgba(71, 84, 103, 1);">
    <a href="${config.FRONTEND_URL}/cookies">Cookies policy</a>
  </p>
  <p style="font-family: Inter; font-size: 10px; font-weight: 400; margin-left:5px; line-height: 22px; color: rgba(71, 84, 103, 1);">
    <a href="${config.FRONTEND_URL}/privacy">Privacy policy</a>
  </p>
  <p style="font-family: Inter; font-size: 10px; font-weight: 400; margin-left:5px; line-height: 22px; color: rgba(71, 84, 103, 1);">
    <a href="${config.FRONTEND_URL}/terms-conditions">Terms & conditions</a>
  </p>
</div>
</div>

                <div style="text-align: center;">
                    <p style="text-align:center; font-family: Inter;font-size: 10px;font-weight: 400;line-height: 22px; color: rgba(71, 84, 103, 1);">© 2023 Schesti . All rights reserved.</p>
                </div>
        </div>
    </div>
</footer>
    `;
}

export function EmailTemplateHeader() {
  return `
    <header>
           
    <div style="background: linear-gradient(180deg, #8449EB 0%, #6A56F6 100%); padding: 40px 48px;">
    <div style="display: inline-block; text-align: left;">
        <img src="${config.SCHESTI_LOGO}" alt="">
    </div>
    <!-- 
    <div style="display: inline-block; text-align: right; margin-left: auto;">
    <img style="width: 17.6px; height: 17.6px;" src="${config.INSTAGRAM_LOGO}" alt="">
    <img style="width: 17.6px; height: 17.6px;" src="${config.FACEBOOK_LOGO}" alt="">
    <img style="width: 17.6px; height: 17.6px;" src="${config.TWITTER_LOGO}" alt="">
    </div>
    -->
</div>


    </header>
    `;
}
