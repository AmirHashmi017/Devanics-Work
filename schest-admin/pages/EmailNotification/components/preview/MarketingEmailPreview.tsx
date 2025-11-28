import React from 'react';
import { EMAIL_TEMPLATE_ASSETS } from 'src/constants/links.constants';

const Info = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="mb-4">
    <p className="text-[#007AB6] font-semibold text-sm text-center leading-5">
      {title}
    </p>
    <p className="text-[#1C1C1C] text-xs font-normal text-center leading-5">
      {description}
    </p>
  </div>
);

const FeatureCard = ({
  featureIMG,
  title,
  subtitle,
  description,
  btn,
  reverse = false,
}: {
  featureIMG: string;
  title: string;
  subtitle: string;
  description: string;
  btn: { link: string; title: string };
  reverse?: boolean;
}) => {
  const content = (
    <div className="flex-1">
      <p className="text-[#007AB6] font-normal text-[10px] leading-3">
        {title}
      </p>
      <p className="text-[#161C2D] text-xs font-semibold leading-5">
        {subtitle}
      </p>
      <p className="text-[#161C2D] text-[10px] font-normal leading-5">
        {description}
      </p>
      <a
        href={btn.link}
        className="text-[#007AB6] text-xs font-semibold leading-4"
      >
        {btn.title}
      </a>
    </div>
  );

  const image = (
    <div className="flex-1">
      <img
        src={featureIMG}
        alt={title}
        className="w-[192px] h-[170px] rounded-md"
      />
    </div>
  );

  return (
    <div className="flex flex-col sm:flex-row p-4 rounded-md bg-[#007AB61A] gap-4">
      {reverse ? (
        <>
          {image}
          {content}
        </>
      ) : (
        <>
          {content}
          {image}
        </>
      )}
    </div>
  );
};

const SchestiMarketingEmailPreview = () => {
  return (
    <div className="space-y-6">
      {/* Bid Management */}
      <section>
        <Info
          title="Project Essentials: Precision & Organization"
          description="Maximize project efficiency and accuracy with tools designed to streamline essential workflows. SCHESTI’s Bid Management & Estimating feature lets you track, refine, and win bids with ease, ensuring every project starts with precision."
        />
        <FeatureCard
          title="Bid Management"
          subtitle="Unlock the Future of Bid Management with SCHESTI"
          description="Track and manage bids effortlessly, ensuring precision and profitability."
          btn={{
            link: process.env.REACT_APP_SCHESTI_BASE_URL!,
            title: 'Explore Bidding',
          }}
          featureIMG={EMAIL_TEMPLATE_ASSETS.MARKETING_EMAIL.BID_MANAGEMENT}
        />
      </section>

      {/* Estimate */}
      <section>
        <Info
          title="Ensure Accurate Cost Projections"
          description="Quickly generate precise estimates to control project costs, improve profitability, and make data-driven bidding decisions."
        />
        <FeatureCard
          title="Estimate"
          subtitle="Ensure Accurate Pricing and Streamlined Planning with SCHESTI"
          description="SCHESTI redefines construction estimating, ensuring unmatched speed, accuracy, and customization throughout every project phase."
          btn={{
            link: process.env.REACT_APP_SCHESTI_BASE_URL!,
            title: 'Get started',
          }}
          featureIMG={EMAIL_TEMPLATE_ASSETS.MARKETING_EMAIL.ESTIMATE}
          reverse
        />
      </section>

      {/* Scheduling */}
      <section>
        <Info
          title="Stay on Time with Real-Time Updates"
          description="Manage project timelines seamlessly with real-time scheduling, helping you stay on top of tasks and meet deadlines with ease."
        />
        <FeatureCard
          title="Scheduling"
          subtitle="Ensure Accurate Pricing and Streamlined Planning with SCHESTI"
          description="SCHESTI redefines construction estimating, ensuring unmatched speed, accuracy, and customization throughout every project phase."
          btn={{
            link: process.env.REACT_APP_SCHESTI_BASE_URL!,
            title: 'Get started',
          }}
          featureIMG={EMAIL_TEMPLATE_ASSETS.MARKETING_EMAIL.TIME_SCHEDULING}
          reverse
        />
      </section>

      {/* Quantity Takeoff */}
      <section>
        <Info
          title="Automate Quantity Calculations"
          description="Save time and avoid errors with automated quantity calculations, keeping resources in check and projects on budget."
        />
        <FeatureCard
          title="Quantity Takeoff"
          subtitle="Revolutionize Your Construction Projects with SCHESTI's Quantity Takeoff Service"
          description="Boost accuracy and efficiency in your construction bids with SCHESTI's Quantity Takeoff Service."
          btn={{
            link: process.env.REACT_APP_SCHESTI_BASE_URL!,
            title: 'Get started',
          }}
          featureIMG={EMAIL_TEMPLATE_ASSETS.MARKETING_EMAIL.QUANTITY_TAKEOFF}
        />
      </section>

      {/* What's New */}
      <section className="p-6 rounded-md my-3 bg-[#FFF9E6] text-center space-y-2">
        <h2 className="text-base font-semibold">What’s New with SCHESTI?</h2>
        <p className="text-sm font-normal">
          Professional Growth & Client Engagement
        </p>
        <a
          href={process.env.REACT_APP_SCHESTI_BASE_URL}
          className="inline-block bg-black text-white px-4 py-3 rounded-md"
        >
          Sign Up Now
        </a>
      </section>

      {/* Networking */}
      <section>
        <Info
          title="Grow Your Professional Connections"
          description="Expand your industry network effortlessly—connect with peers, share insights, and stay ahead with professional growth opportunities."
        />
        <FeatureCard
          title="Networking"
          subtitle="Simplify Your Partner Search with SCHESTI's Smart Networking Solutions"
          description="Schesti connects GCs, subcontractors, and suppliers globally, enhancing collaboration and offering tools for project showcasing, bid management, and AI take-offs to streamline preconstruction processes."
          btn={{
            link: process.env.REACT_APP_SCHESTI_BASE_URL!,
            title: 'Get started',
          }}
          featureIMG={EMAIL_TEMPLATE_ASSETS.MARKETING_EMAIL.NETWORKING}
          reverse
        />
      </section>

      {/* Social Media Integration */}
      <section>
        <Info
          title="Engage Clients and Showcase Your Work"
          description="Easily manage your online presence with built-in social media tools to promote your portfolio and keep clients engaged."
        />
        <FeatureCard
          title="Social Media Integration"
          subtitle="Simplify Your Partner Search with SCHESTI's Smart Networking Solutions"
          description="Showcase your portfolio and keep clients engaged with built-in professional social media support."
          btn={{
            link: process.env.REACT_APP_SCHESTI_BASE_URL!,
            title: 'Get started',
          }}
          featureIMG={EMAIL_TEMPLATE_ASSETS.MARKETING_EMAIL.SOCIAL_MEDIA}
          reverse
        />
      </section>
    </div>
  );
};

export default SchestiMarketingEmailPreview;
