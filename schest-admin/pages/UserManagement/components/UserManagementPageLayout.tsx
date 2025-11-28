type Props = {
  children: React.ReactNode;
};
export function UserManagementLayout({ children }: Props) {
  return (
    <section className="mt-6 mb-[39px] mx-4 rounded-xl bg-white shadow-xl px-8 py-9">
      {children}
    </section>
  );
}
