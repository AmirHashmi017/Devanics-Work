'use client';
import { withAuth } from '@/app/hoc/withAuth';
import dynamic from 'next/dynamic';
const Contractors = dynamic(
  () => import('../components/contractors').then((m) => m.Contractors),
  { ssr: false }
);

function StandardInvoicingPage() {
  return (
    <section className="mt-6 mb-[39px] bg-white  mx-4 rounded-xl ">
      <div className="w-full mb-4 p-5">
        <Contractors />
      </div>
    </section>
  );
}

export default withAuth(StandardInvoicingPage);
