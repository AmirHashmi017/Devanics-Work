import {
  CommonCrmType,
  CrmModuleType,
  CrmSubcontractorParsedType,
  CrmType,
} from '@/app/interfaces/crm/crm.interface';
import crmService from '@/app/services/crm/crm.service';
import { Excel } from 'antd-table-saveas-excel';
import type { ColumnsType } from 'antd/es/table';
import { AxiosError } from 'axios';
import React, { ChangeEventHandler } from 'react';
import { toast } from 'react-toastify';

type ParseData = CommonCrmType | CrmSubcontractorParsedType;
export const uploadAndParseCSVData =
  <T = ParseData>(
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    module: CrmModuleType,
    setParseData: React.Dispatch<React.SetStateAction<T[]>>
  ): ChangeEventHandler<HTMLInputElement> =>
  async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsLoading(true);
      try {
        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);
        const response = await crmService.httpParseCsvFile(formData, module);
        if (response.data) {
          toast.success('File parsed successfully');
          setParseData(response.data as T[]);
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        toast.error(err.response?.data.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

export async function saveManyCrmItems<
  ParsedType extends ParseData = ParseData,
>(
  data: ParsedType[],
  setIsSavingMany: React.Dispatch<React.SetStateAction<boolean>>,
  module: CrmModuleType,
  setDuplicates: React.Dispatch<React.SetStateAction<ParsedType[]>>,
  onSuccessInsert: (_items: CrmType[]) => void
) {
  setIsSavingMany(true);
  try {
    const response = await crmService.httpCreateMany(
      data as ParsedType[],
      module
    );
    if (response.data) {
      if (response.data.duplicates.length) {
        toast.success(`Duplicate ${module} found`);
        setDuplicates(response.data.duplicates as ParsedType[]);
      }
      if (response.data.items.length) {
        onSuccessInsert(response.data.items);
      }
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    console.log(err.response?.data);
    if (err.response?.data) {
      toast.error(err.response?.data.message || 'An error occurred');
    }
  } finally {
    setIsSavingMany(false);
  }
}

export function downloadCrmItemsAsCSV(
  data: CrmType[],
  columns: ColumnsType<CrmType>,
  module: CrmModuleType
) {
  if (!data.length) {
    toast.error('No data found');
    return;
  }
  const excel = new Excel();
  excel
    .addSheet(module)
    .addColumns(columns.slice(0, columns.length - 2) as any)
    .addDataSource(data)
    .saveAs(`crm-${module}-${Date.now()}.xlsx`);
}

export async function deleteCrmItemById(
  id: string,
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>,
  onSuccess: (_item: CrmType) => void
) {
  setIsDeleting(true);
  try {
    const response = await crmService.httpfindByIdAndDelete(id);
    if (response.data) {
      onSuccess(response.data);
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    toast.error(err.response?.data?.message || err.message);
  } finally {
    setIsDeleting(false);
  }
}

export async function findCrmItemById(
  id: string,
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>,
  onSuccess: (_item: CrmType) => void
) {
  if (id) {
    setIsFetching(true);
    try {
      const response = await crmService.httpGetItemById(id);
      if (response.data) {
        onSuccess(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'Unable to fetch client');
    } finally {
      setIsFetching(false);
    }
  }
}

export function formatCrmModuleType(module: CrmModuleType | undefined): string {
  if (!module) {
    throw new Error('Invalid crm module type');
  }

  switch (module) {
    case 'clients':
      return 'Client';
    case 'vendors':
      return 'Vendor';
    case 'architects':
      return 'Architect';
    case 'contractors':
      return 'Contractor';
    case 'partners':
      return 'Partner';
    case 'subcontractors':
      return 'Subcontractor';
    default:
      throw new Error('Invalid crm module type');
  }
}

export function getCrmItemName(item: CrmType) {
  if (
    item.module === 'partners' ||
    item.module === 'subcontractors' ||
    item.module === 'contractors'
  ) {
    return `${item.companyRep}`;
  }
  return `${item.firstName} ${item.lastName || ''}`;
}

export function getCrmItemCompany(item: CrmType) {
  if (
    item.module === 'partners' ||
    item.module === 'subcontractors' ||
    item.module === 'contractors'
  ) {
    return `${item.name}`;
  }
  return `${item.companyName}`;
}
