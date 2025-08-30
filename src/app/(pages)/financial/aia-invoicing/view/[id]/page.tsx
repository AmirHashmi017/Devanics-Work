'use client';

import { useParams } from 'next/navigation';
import { NoInvoiceFound } from './components/NoInvoiceFound';
import { PhaseComponent } from './components';
import { withAuth } from '@/app/hoc/withAuth';
import { clientInvoiceService } from '@/app/services/client-invoices.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { IAIAInvoice } from '@/app/interfaces/client-invoice.interface';
import { Skeleton } from 'antd';

function ClientInvoicePage() {
  const [loading, setLoading] = useState(false);
  const params = useParams<{ id: string }>();
  const [parentInvoice, setParentInvoice] = useState<IAIAInvoice | null>(null);

  useEffect(() => {
    getParentInvoice();
  }, [params.id]);

  async function getParentInvoice() {
    if (params.id) {
      setLoading(true);
      try {
        const response = await clientInvoiceService.httpGetParentInvoiceById(
          params.id
        );
        if (response.data) {
          setParentInvoice(response.data.invoice);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message);
      } finally {
        setLoading(false);
      }
    }
  }
  if (loading) {
    return <Skeleton />;
  }
  if (!parentInvoice) {
    return <NoInvoiceFound />;
  }

  return <PhaseComponent parentInvoice={parentInvoice} />;
}

export default withAuth(ClientInvoicePage);
