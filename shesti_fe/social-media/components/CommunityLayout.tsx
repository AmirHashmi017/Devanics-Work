import CommunitySidebarNavigation from './CommunitySidebar';

type Props = {
  children: React.ReactNode;
};

export function CommunityLayout({ children }: Props) {
  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-2">
        <CommunitySidebarNavigation />
      </div>
      <div className="col-span-10">{children}</div>
    </div>
  );
}
