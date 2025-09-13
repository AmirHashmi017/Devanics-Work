import { Routes } from "@/app/utils/plans.utils"
import MinProfileCard from "./MinProfileCard"
import { CoworkersIcon, FeedsIcon, JobsIcon, MessagesIcon } from "./sidebar/Icons"
import { SidebarNavigation } from "./sidebar/SidebarNavigation"
import { useRouterHook } from "@/app/hooks/useRouterHook";
import { usePathname } from "next/navigation";
import { JobsFilter } from "./JobsFilter";

export default function CommunitySidebarNavigation() {
    const router = useRouterHook();
    const pathname = usePathname();
    const navigationItems = [
        {
            id: "feeds",
            icon: <FeedsIcon />,
            label: "Feeds",
            href: Routes.SocialMedia,
        },
        {
            id: "messages",
            icon: <MessagesIcon />,
            label: "Messages",
            href: `${Routes.SocialMedia}/messages`,
        },
        {
            id: "coworkers",
            icon: <CoworkersIcon />,
            label: "Coworkers",
            href: `${Routes.SocialMedia}/coworkers`,
        },
        {
            id: "jobs",
            icon: <JobsIcon />,
            label: "Jobs",
            href: `${Routes.SocialMedia}/jobs`,
        },
    ]

    const handleNavigationChange = (href: string) => {
        router.push(href);
    }

    return (
        <div className="space-y-4">
            <SidebarNavigation
                items={navigationItems}
                defaultActiveId={pathname}
                onChange={handleNavigationChange}
                className="max-w-md"
            />
            {!pathname.includes("jobs") && <MinProfileCard />}

            {pathname.includes("jobs") && <JobsFilter />}
        </div>
    )
}

