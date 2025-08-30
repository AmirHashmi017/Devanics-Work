'use client';

import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { withAuth } from '@/app/hoc/withAuth';
import { SearchOutlined } from '@ant-design/icons';
import { Drawer, Dropdown } from 'antd';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import costCodeData from '../cost-code';
import moment from 'moment';
import { FileView } from '@/app/component/file-view/FileView';
import { FileInterface } from '@/app/interfaces/file.interface';
import Image from 'next/image';
import { DeleteContent } from '@/app/component/delete/DeleteContent';
import ModalComponent from '@/app/component/modal';
import { IFinancialAsset } from '@/app/interfaces/financial/financial-asset.interface';
import financialAssetService from '@/app/services/financial/financial-asset.service';
import { AssetForm } from './components/Form';
import { Excel } from 'antd-table-saveas-excel';
import _ from 'lodash';
import { CurrencyFormat } from '@/app/utils/format';

function AssetPage() {
  const [search, setSearch] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isloading, setIsloading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IFinancialAsset | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [data, setData] = useState<{
    count: number;
    assets: IFinancialAsset[];
  }>({
    count: 0,
    assets: [],
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchData();
  }, [pagination]);

  const columns: ColumnsType<IFinancialAsset> = [
    {
      title: 'Sr#',
      dataIndex: 'invoiceNo',
    },
    { title: 'Asset Name', dataIndex: 'name' },
    { title: 'Project', dataIndex: 'project' },
    {
      title: 'Trades/Division',
      dataIndex: 'costCode',
      render(value) {
        return costCodeData.find((item) => item.id === value)?.division;
      },
    },
    {
      title: 'Description',
      dataIndex: 'costCode',
      render(value) {
        return costCodeData.find((item) => item.id === value)?.description;
      },
    },
    {
      title: 'Cost',
      dataIndex: 'totalPrice',
      render(value, record) {
        return CurrencyFormat(
          value,
          record.currency?.locale,
          record.currency?.code
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'assetDate',
      render(value) {
        return moment(value).format('DD-MM-YYYY');
      },
    },
    {
      title: 'File',
      dataIndex: 'file',
      render(value?: FileInterface) {
        if (value) {
          return <FileView {...value} />;
        }
        return null;
      },
    },
    {
      title: 'Action',
      render(_value, record) {
        return (
          <Dropdown
            menu={{
              items: [
                {
                  label: 'Edit',
                  key: 'edit',
                  onClick: () => {
                    setSelectedItem(record);
                    setShowDrawer(true);
                  },
                },
                {
                  label: 'Delete',
                  key: 'delete',
                  onClick: () => {
                    setSelectedItem(record);
                    setShowDeleteModal(true);
                  },
                },
              ],
            }}
          >
            <Image
              src="/menuIcon.svg"
              alt="more"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </Dropdown>
        );
      },
    },
  ];

  async function fetchData() {
    setIsloading(true);
    try {
      const response = await financialAssetService.httpGetAllAssets(
        pagination.page,
        pagination.limit
      );
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsloading(false);
    }
  }

  async function deleteAsset(id: string) {
    setIsDeleting(true);
    try {
      const response = await financialAssetService.httpDeleteAsset(id);
      if (response.data) {
        toast.success('Asset deleted successfully');
        setShowDeleteModal(false);
        setData({
          ...data,
          assets: data.assets.filter((item) => item._id !== id),
        });
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="mt-6  space-y-2 mb-[39px] mx-4 rounded-xl bg-white p-5">
      <Drawer
        title="Asset"
        open={showDrawer}
        onClose={() => {
          setSelectedItem(null);
          setShowDrawer(false);
        }}
        width={800}
        destroyOnClose
      >
        <AssetForm
          item={selectedItem ? selectedItem : undefined}
          onSuccess={(newItem) => {
            if (selectedItem) {
              setData({
                ...data,
                assets: data.assets.map((item) => {
                  if (item._id === selectedItem._id) {
                    return newItem;
                  }
                  return item;
                }),
              });
            } else {
              setData({
                ...data,
                assets: [newItem, ...data.assets],
              });
            }
            setShowDrawer(false);
            setSelectedItem(null);
          }}
        />
      </Drawer>

      {selectedItem && showDeleteModal ? (
        <ModalComponent
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          width="30%"
        >
          <DeleteContent
            onClick={() => {
              deleteAsset(selectedItem._id);
            }}
            isLoading={isDeleting}
            onClose={() => setShowDeleteModal(false)}
          />
        </ModalComponent>
      ) : null}

      <div className="flex justify-between items-center mb-4">
        <TertiaryHeading
          title="Assets/Inventory"
          className="text-graphiteGray"
        />
        <div className=" flex items-center space-x-3">
          <div className="w-96">
            <InputComponent
              label=""
              type="text"
              placeholder="Search"
              name="search"
              prefix={<SearchOutlined />}
              field={{
                type: 'text',
                value: search,
                onChange: (e: any) => {
                  setSearch(e.target.value);
                },
                className: '!py-2',
              }}
            />
          </div>

          <div>
            <WhiteButton
              text="Export"
              className="!w-fit !py-2.5"
              icon="/download-icon.svg"
              iconwidth={20}
              iconheight={20}
              onClick={() => {
                const assets = _.filter(data.assets, (item) =>
                  selectedRowKeys.includes(item._id)
                );
                if (!assets.length) {
                  toast.error('No data to export');
                  return;
                }
                const excel = new Excel();
                excel
                  .addSheet('Assets')
                  // exlcude file columns  as  well
                  .addColumns(columns.slice(0, columns.length - 2) as any)
                  .addDataSource(assets)
                  .saveAs('Assets.xlsx');
              }}
            />
          </div>
          <CustomButton
            text="Add Asset"
            className="!w-fit !py-2.5"
            icon="/plus.svg"
            iconwidth={20}
            iconheight={20}
            onClick={() => setShowDrawer(true)}
          />
        </div>
      </div>

      <Table
        columns={columns}
        pagination={{
          position: ['bottomCenter'],
          total: data.count,
          current: pagination.page,
          onChange(page, pageSize) {
            setPagination({ ...pagination, page, limit: pageSize });
          },
          showSizeChanger: true,
          pageSize: pagination.limit,
        }}
        dataSource={data.assets.filter((item) => {
          if (search) {
            return (
              item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.note.toLowerCase().includes(search.toLowerCase()) ||
              item.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
              item.project.toLowerCase().includes(search.toLowerCase()) ||
              item.totalPrice
                .toString()
                .toLowerCase()
                .includes(search.toLowerCase())
            );
          }
          return true;
        })}
        bordered
        loading={isloading}
        rowSelection={{
          onChange: (newSelectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
          },
          selectedRowKeys,
        }}
        rowKey={(item) => item._id}
      />
    </section>
  );
}

export default withAuth(AssetPage);
