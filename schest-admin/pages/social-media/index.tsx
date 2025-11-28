import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPostData } from 'src/redux/social-media/social-media.slice';
import ReportRequest from './components/report-requests';
import BlockedUsers from './components/blocked-users';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import AllPosts from './components/all-posts';

const socialNetworkTabs = [
  {
    title: 'All Posts',
    Component: <AllPosts />,
  },
  {
    title: 'Report Request',
    Component: <ReportRequest />,
  },
  {
    title: 'Blocked Users',
    Component: <BlockedUsers />,
  },
];
const SocialMedia = () => {
  const dispatch = useDispatch();

  const [currentSection, setCurrentSection] = useState(0);

  const SocialMediaSections = [AllPosts, ReportRequest, BlockedUsers];
  const SocialComponent = SocialMediaSections[currentSection];

  useEffect(() => {
    dispatch(setPostData(null));
  }, []);

  return (
    <section className="my-4 mx-8 px-4 gap-6">
      <h6 className="text-lg font-semibold text-graphiteGray">Social Media</h6>
      <div className="col-span-4 mt-3.5">
        <div className="flex gap-3 justify-between items-center">
          <div className="w-full flex gap-3 col-span-2 items-center max-w-md shadow rounded-xl p-2 bg-white">
            {socialNetworkTabs.map(({ title }, i) => (
              <button
                key={i}
                onClick={() => setCurrentSection(i)}
                className={twMerge(
                  clsx(
                    'text-sm w-full cursor-pointer bg-transparent text-graphiteGray py-2 px-3 rounded-md',
                    i === currentSection &&
                      'bg-schestiPrimary text-white font-semibold'
                  )
                )}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
        <div className="py-6">
          <SocialComponent />
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;
