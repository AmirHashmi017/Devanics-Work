'use client';
import { Clients } from '../components/clients';
import { withAuth } from '@/app/hoc/withAuth';

function AIAInvoicingPage() {
  return (
    <section className="mt-6 mb-[39px] bg-white p-5 mx-4 rounded-xl ">
      <div className="w-full mb-4">
        <Clients />
      </div>
    </section>
  );
}

export default withAuth(AIAInvoicingPage);
