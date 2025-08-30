import { Popups } from '@/app/(pages)/bid-management/components/Popups';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { CrmModuleType, CrmType } from '@/app/interfaces/crm/crm.interface';
import crmService from '@/app/services/crm/crm.service';
import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import {
  formatCrmModuleType,
  getCrmItemCompany,
  getCrmItemName,
} from '../../crm/utils';
import { ContractPartyType } from '@/app/interfaces/crm/crm-contract.interface';
import { NoDataComponent } from '@/app/component/noData/NoDataComponent';

type Props = {
  title: string;
  onClose: () => void;
  onItemClick: (
    _item: Omit<ContractPartyType, '_id' | 'color' | 'tools' | 'type'>
  ) => void;
};
export function ListCrmItems({ title, onClose, onItemClick }: Props) {
  const [items, setItems] = useState<CrmType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [module, setModule] = useState<CrmModuleType>('clients');

  useEffect(() => {
    fetchItems(module);
  }, [module]);

  async function fetchItems(mod: CrmModuleType) {
    setIsLoading(true);
    const response = await crmService.httpGetItems({ module: mod });
    if (response.data) {
      setItems(response.data);
    }
    setIsLoading(false);
  }

  return (
    <Popups title={title} onClose={onClose}>
      <div className="my-3">
        <SelectComponent
          label="Select Module"
          name="module"
          placeholder="Select Module"
          field={{
            value: formatCrmModuleType(module),
            options: [
              { label: formatCrmModuleType('clients'), value: 'clients' },
              { label: formatCrmModuleType('vendors'), value: 'vendors' },
              { label: formatCrmModuleType('architects'), value: 'architects' },
              {
                label: formatCrmModuleType('subcontractors'),
                value: 'subcontractors',
              },
              { label: 'Contractors', value: 'contractors' },
            ] as { label: string; value: CrmModuleType }[],
            onChange(value) {
              setModule(value as CrmModuleType);
            },
          }}
        />
      </div>
      {isLoading ? (
        <div>
          <Skeleton />
        </div>
      ) : items.length === 0 ? (
        <NoDataComponent title="List" description="No Data Found" />
      ) : (
        items.map((item) => {
          return (
            <div
              key={item._id}
              className="p-3 my-1 border-b hover:bg-schestiPrimaryBG cursor-pointer hover:rounded-md"
              onClick={() =>
                onItemClick({
                  companyName: getCrmItemCompany(item),
                  email: item.email,
                  name: getCrmItemName(item),
                  address: item.address,
                  phone: item.phone,
                  pdf: '',
                })
              }
            >
              <div className="flex font-semibold text-schestiPrimaryBlack text-xs items-center space-x-3">
                <p className="">
                  {' '}
                  <span className="text-schestiLightBlack">Name: </span>{' '}
                  {item.module === 'subcontractors' ||
                  item.module === 'partners' ||
                  item.module === 'contractors'
                    ? item.companyRep
                    : `${item.firstName} ${item.lastName || ''}`}
                </p>
                <p>
                  <span className="text-schestiLightBlack">Company: </span>{' '}
                  {item.module === 'subcontractors' ||
                  item.module === 'partners' ||
                  item.module === 'contractors'
                    ? item.name
                    : item.companyName}
                </p>
              </div>
              <div className="font-semibold text-schestiPrimaryBlack text-xs">
                <span className="text-schestiLightBlack mr-1">Email:</span>
                {item.email}
              </div>
            </div>
          );
        })
      )}
    </Popups>
  );
}
