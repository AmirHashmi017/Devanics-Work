import { SelectComponent } from '@/app/component/customSelect/Select.component';
import { CrmModuleType, CrmType } from '@/app/interfaces/crm/crm.interface';
import crmService from '@/app/services/crm/crm.service';
import { List, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { formatCrmModuleType } from '../../crm/utils';
import { NoDataComponent } from '@/app/component/noData/NoDataComponent';

type Props = {
  onItemClick: (_item: CrmType) => void;
  selectedItems?: string[];
};

export function ListCrmItems({ onItemClick, selectedItems }: Props) {
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
    <div className="space-y-1">
      <div>
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
        <div className="h-[300px] overflow-y-auto border rounded-md p-2">
          <List
            itemLayout="horizontal"
            dataSource={items}
            rowKey={(item) => item._id}
            renderItem={(item) => (
              <List.Item
                className={` ${selectedItems?.includes(item._id) ? 'bg-schestiLightGray' : 'hover:bg-schestiPrimaryBG'} cursor-pointer hover:rounded-md`}
                style={{
                  borderBottom: '1px solid #e5e5e5',
                  margin: '5px 0px',
                  borderRadius: '5px',
                }}
                onClick={() => onItemClick(item)}
              >
                <List.Item.Meta
                  className="p-1 my-1  "
                  title={
                    <div className="flex font-semibold text-schestiPrimaryBlack text-xs items-center space-x-3 ">
                      <p className="">
                        {' '}
                        <span className="text-schestiLightBlack">
                          Name:{' '}
                        </span>{' '}
                        {item.module === 'subcontractors' ||
                        item.module === 'partners' ||
                        item.module === 'contractors'
                          ? item.companyRep
                          : `${item.firstName} ${item.lastName || ''}`}
                      </p>
                      <p>
                        <span className="text-schestiLightBlack">
                          Company:{' '}
                        </span>{' '}
                        {item.module === 'subcontractors' ||
                        item.module === 'partners' ||
                        item.module === 'contractors'
                          ? item.name
                          : item.companyName}
                      </p>
                    </div>
                  }
                  description={
                    <div className="font-semibold text-schestiPrimaryBlack text-xs">
                      <div>
                        <span className="text-schestiLightBlack mr-1">
                          Email:
                        </span>
                        {item.email}
                      </div>
                      <div>
                        <span className="text-schestiLightBlack mr-1">
                          Phone:
                        </span>
                        {item.phone}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
}
