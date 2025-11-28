import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { quaternaryHeading } from '../TailwindVariables';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

const tabsData = [
  { name: 'Companies', route: '/companies' },
  { name: 'Pricing Plans', route: '/plans' },
  { name: 'Ad Managment', route: '/ad-managment' },
  { name: 'Promo Code', route: '/promo-code' },
  { name: 'Bid Managment', route: '/projects' },
  { name: 'Transaction History', route: '/transactions' },
  { name: 'Support Tickets', route: '/supportickets' },
];

const Tabs = () => {
  const { pathname } = useLocation();

  return (
    <div className="md:flex block justify-between items-center px-16 xl:h-[67px] shadow-quinaryGentle">
      <ul
        className="list-none flex flex-wrap xl:gap-8 gap-3 text-sm font-medium text-center
            text-gray-500 dark:text-gray-400 justify-center mb-0"
      >
        <>
          <NavLink
            to="/"
            className={twMerge(
              clsx(
                `${quaternaryHeading} text-steelGray
                flex items-stretch justify-center py-2 
                 cursor-pointer 
                `,
                pathname === '/' && 'border-b-2 border-[#ffc107]'
              )
            )}
          >
            Dashbaord
          </NavLink>
          {tabsData.map(({ name, route }, i) => {
            return (
              <NavLink
                to={route}
                className={twMerge(
                  clsx(
                    `${quaternaryHeading} text-steelGray
                flex items-stretch justify-center py-2 
                 cursor-pointer 
                `,
                    pathname.includes(route.split('/')[1]) &&
                      'border-b-2 border-[#ffc107]'
                  )
                )}
                key={i}
              >
                {name}
              </NavLink>
            );
          })}
        </>
      </ul>
    </div>
  );
};

export default Tabs;
