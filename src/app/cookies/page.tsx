/* eslint-disable no-irregular-whitespace */
import LandingFooter from '../component/footer/LandingFooter';
import { LandingNavbar } from '../component/navbar/LandingNavbar';

export default function CookiesPage() {
  return (
    <section>
      <main
        style={{
          background: 'linear-gradient(180deg, #8449EB 0%, #6A56F6 100%)',
        }}
        className="h-[501px] relative"
      >
        <LandingNavbar />
        <div className="mt-[101px] xl:mx-auto xl:w-[1063px]">
          <h1 className="text-center font-extrabold text-white text-[48px] leading-[57px] xl:text-[64px] xl:leading-[80px]">
            COOKIE POLICY
          </h1>
          <p className="text-center text-white xl:w-[774px] leading-[30px] text-[18px] xl:leading-[44px] font-light xl:text-[24px] xl:mx-auto my-[26px]">
            Data Controller: Schesti Technologies, Inc., Address: 5109
            Hollyridge Dr, Ste 102 Raleigh, NC 27612, USA, Email:
            legal@Schesti.com
          </p>
        </div>
      </main>

      <div className="px-[20px] space-y-3 lg:px-[100px] xl:px-[200px] my-[50px] ">
        <div className="space-y-2">
          <Title title="Welcome to Schesti!" />
          <Description
            description="This document is designed to inform you about our practices regarding cookie usage. It elaborates on the essence of cookies, how Schesti utilizes them, your options concerning cookies, and where you can find more details about them.
Incorporated into our Terms of Service and Privacy Policy, this Cookie Policy, along with your consents, forms our contractual relationship with you.
For any inquiries, please use the contact information provided below."
          />
        </div>

        <div className="space-y-2">
          <div className="flex space-x-2 items-center">
            <Description description="Data Controller:" />
            <Title title="Schesti Technologies, Inc." />
          </div>
          <div className="flex space-x-2 items-center">
            <Description description="Address:" />
            <Title title="5109 Hollyridge Dr, Ste 102 Raleigh NC 27612, USA" />
          </div>
          <div className="flex space-x-2 items-center">
            <Description description="Email:" />
            <Title title="legal@Schesti.com" />
          </div>
        </div>

        <div className="space-y-2">
          <Description
            description={`Schesti's Use of Cookies: Schesti ("we," "our," or "us") employs cookies and similar technologies on our website http://www.Schesti.com and the Schesti web application ("Services"). By interacting with our Services and accepting the prompts on our banners, you consent to our cookie usage as outlined in this policy.
                    Understanding Cookies: Cookies are small text files sent to your browser by websites you visit. They help our server to remember you and your preferences for a more personalized experience upon your next visit to our Services. Your browser notifies our systems about any cookies on your device, enabling us to gather information from them.`}
          />
          <Description description="Types and Purposes of Cookies We Use: Schesti employs cookies for various purposes when you access our Services:" />
        </div>

        <div className="space-y-2">
          <Title title="Essential Cookies:" />
          <Description description="These are crucial for the operation of our website and do not collect personally identifiable information. They might be session cookies, expiring after your session ends, or persist for up to two years." />
        </div>

        <div className="space-y-2">
          <Title title="Performance and Analytics:" />
          <Description description="These cookies help us understand the performance of our website and Services across different locales. They assist in gauging user interaction, improving content, and enhancing the user experience, with a storage life of up to two years." />
        </div>

        <div className="space-y-2">
          <Title title="Functional Cookies:" />
          <Description description="These improve your experience by remembering your preferences. They can be either session cookies or persistent cookies requiring manual deletion." />
        </div>

        <div className="space-y-2">
          <Title title="Targeting Cookies:" />
          <Description description="Schesti may utilize cookies to deliver more relevant advertisements. These cookies provide insights into your previous visits and activities, including visit dates and pages viewed. They may persist for up to three years." />
        </div>

        <div>
          <Description
            description="Third-party cookies from platforms like LinkedIn, Google, Vimeo, Bing, Snapchat, Facebook, and YouTube may be set by our website.
                    Managing Cookies: You can manage your cookie preferences during your first visit or adjust them later. The “Show details” option allows you to review and select specific cookie types. By accepting all cookies, you consent to our use of cookies for the mentioned purposes. If you wish to use our Services with only essential cookies, you can select this option in your preferences.
                    You can also withdraw your consent or change your cookie settings at any time by contacting us. Web browsers offer controls to manage cookies on your device, but disabling all cookies may impact your experience on our website.
                    For More Information on Cookies: You can learn more about cookies and their management through resources like:"
          />
        </div>

        <div>
          <Description description="All About Cookies: https://allaboutcookies.org/" />
        </div>

        <div>
          <Description description="· Network Advertising Initiative: https://www.networkadvertising.org" />
        </div>
      </div>

      <LandingFooter />
    </section>
  );
}

function Title({ title }: { title: string }) {
  return (
    <h2 className="text-base leading-7 text-[#101828] font-semibold">
      {title}
    </h2>
  );
}

function Description({ description }: { description: string }) {
  return (
    <p className="text-[#333E4F] text-base leading-7 font-normal">
      {description}
    </p>
  );
}
