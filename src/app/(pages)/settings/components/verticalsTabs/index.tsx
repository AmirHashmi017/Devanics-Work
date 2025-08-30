'use client';
import { USER_ROLES_ENUM } from '@/app/constants/constant';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { useUser } from '@/app/hooks/useUser';
import { OtherRoutes } from '@/app/utils/plans.utils';
import { bg_style, senaryHeading } from '@/globals/tailwindvariables';
import { usePathname, useParams } from 'next/navigation';

const Index = () => {
  const router = useRouterHook();
  const pathname = usePathname();
  const { id } = useParams();
  const authUser = useUser();

  const active =
    'bg-schestiLightPrimary  text-schestiPrimary w-full rounded-[6px] font-semibold';
  let tabs = [
    { id: 1, name: 'General Settings', route: ['/settings/general'] },
    { id: 2, name: 'Plans', route: ['/settings/plans'] },
    { id: 2, name: 'Category Setup', route: ['/settings/CategorySetup'] },
    {
      id: 3,
      name: 'User Managements',
      route: [
        '/settings/companyUser',
        '/settings/companyUser/addCompanyUser',
        OtherRoutes.Settings.Company_Roles,
      ],
    },
    { id: 4, name: 'Market Price Material', route: ['/settings/materials'] },
    { id: 5, name: 'Target', route: ['/settings/target'] },
    { id: 10, name: 'Currency', route: ['/settings/currency'] },
    {
      id: 6,
      name: 'Support Ticket',
      route: [
        '/settings/supporttickets',
        '/settings/supporttickets/create',
        `/settings/supporttickets/edit/${id}`,
        `/settings/supporttickets/${id}`,
      ],
    },
  ];

  if (authUser?.userRole === USER_ROLES_ENUM.SUBCONTRACTOR) {
    tabs = [
      ...tabs,
      { id: 7, name: 'Verification', route: ['/settings/verification'] },
      { id: 8, name: 'Trades', route: ['/settings/trades'] },
    ];
  } else if (
    authUser?.userRole !== USER_ROLES_ENUM.PROFESSOR ||
    authUser?.userRole !== USER_ROLES_ENUM.STUDENT ||
    authUser?.userRole !== USER_ROLES_ENUM.OWNER
  ) {
    tabs = [
      ...tabs,
      { id: 7, name: 'Verification', route: ['/settings/verification'] },
    ];
  }

  return (
    <div
      className={`${bg_style} md:min-w-[222px] p-3 sticky top-0 left-0 right-0`}
    >
      <div className="flex flex-col gap-2">
        {tabs.map((tab, index) => (
          <p
            key={tab.id + index}
            className={`py-3 px-3 !text-sm cursor-pointer transition-colors ${senaryHeading} ${
              tab.route.includes(pathname) ? active : ''
            } `}
            onClick={() => router.push(tab.route[0])}
          >
            {tab.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Index;
