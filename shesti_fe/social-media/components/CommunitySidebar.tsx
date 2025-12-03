import { Routes } from '@/app/utils/plans.utils';
import MinProfileCard from './MinProfileCard';
import {
  CoworkersIcon,
  FeedsIcon,
  JobsIcon,
  MessagesIcon,
} from './sidebar/Icons';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { useRouterHook } from '@/app/hooks/useRouterHook';
import { usePathname } from 'next/navigation';
import { JobsFilter } from './JobsFilter';

export default function CommunitySidebarNavigation() {
  const router = useRouterHook();
  const pathname = usePathname();
  const navigationItems = [
    {
      id: 'feeds',
      icon: <FeedsIcon />,
      label: 'Feeds',
      href: Routes.SocialMedia,
    },
    {
      id: 'messages',
      icon: <MessagesIcon />,
      label: 'Messages',
      href: `${Routes.SocialMedia}/messages`,
    },
    {
      id: 'coworkers',
      icon: <CoworkersIcon />,
      label: 'Coworkers',
      href: `${Routes.SocialMedia}/coworkers`,
    },
    {
      id: 'jobs',
      icon: <JobsIcon />,
      label: 'Jobs',
      href: `${Routes.SocialMedia}/jobs`,
    },
  ];

  const handleNavigationChange = (href: string) => {
    router.push(href);
  };

  // Function to determine the active item ID
  const getActiveId = () => {
    // Sort by href length (descending) to check longer paths first
    const sortedItems = [...navigationItems].sort(
      (a, b) => b.href.length - a.href.length
    );

    // Find the first item that matches the current pathname
    const activeItem = sortedItems.find((item) => {
      if (item.href === Routes.SocialMedia) {
        // For the base route (feeds), check for exact match
        return pathname === Routes.SocialMedia;
      } else {
        // For sub-routes, check if pathname starts with the href
        return pathname.startsWith(item.href);
      }
    });

    // If no specific match found and we're on the base route, default to feeds
    if (!activeItem && pathname === Routes.SocialMedia) {
      return 'feeds';
    }

    return activeItem?.id || '';
  };

  const isJobsList = pathname === `${Routes.SocialMedia}/jobs`;
  const isJobsSection = pathname.startsWith(`${Routes.SocialMedia}/jobs`);

  return (
    <div className="space-y-4">
      <SidebarNavigation
        items={navigationItems}
        activeId={getActiveId()}
        onChange={handleNavigationChange}
        className="max-w-md"
      />

      {!isJobsSection && <MinProfileCard />}

      {isJobsList && <JobsFilter />}
    </div>
  );
}
