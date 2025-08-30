'use client';

import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { withAuth } from '@/app/hoc/withAuth';
import { SearchOutlined } from '@ant-design/icons';
import { Drawer, Dropdown, Tag } from 'antd';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { ExpenseForm } from './components/Form';
import { IFinancialExpense } from '@/app/interfaces/financial/financial-expense.interface';
import financialExpenseService from '@/app/services/financial/financial-expense.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import costCodeData from '../cost-code';
import moment from 'moment';
import { FileView } from '@/app/component/file-view/FileView';
import { FileInterface } from '@/app/interfaces/file.interface';
import Image from 'next/image';
import { DeleteContent } from '@/app/component/delete/DeleteContent';
import ModalComponent from '@/app/component/modal';
import { Excel } from 'antd-table-saveas-excel';
import _ from 'lodash';
import { CollectExpensePayment } from './components/CollectPayment';
import { CurrencyFormat } from '@/app/utils/format';

function Expense() {
  const [search, setSearch] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [isloading, setIsloading] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<IFinancialExpense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [data, setData] = useState<{
    count: number;
    expenses: IFinancialExpense[];
  }>({
    count: 0,
    expenses: [],
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    fetchData();
  }, [pagination]);

  const columns: ColumnsType<IFinancialExpense> = [
    {
      title: 'Expense#',
      dataIndex: 'invoiceNo',
    },
    { title: 'Expense Name', dataIndex: 'name' },
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
      dataIndex: 'expenseDate',
      render(value) {
        return moment(value).format('DD-MM-YYYY');
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(value) {
        if (value === 'paid') {
          return <Tag color="green">Paid</Tag>;
        } else if (value === 'unpaid') {
          return <Tag color="red">Unpaid</Tag>;
        }
        return null;
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
                  label: 'Make a Payment',
                  key: 'collectPayment',
                  onClick: () => {
                    setSelectedExpense(record);
                    setShowCollectModal(true);
                  },
                },
                {
                  label: 'Edit',
                  key: 'edit',
                  onClick: () => {
                    setSelectedExpense(record);
                    setShowDrawer(true);
                  },
                },
                {
                  label: 'Delete',
                  key: 'delete',
                  onClick: () => {
                    setSelectedExpense(record);
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
      const response = await financialExpenseService.httpGetAllExpenses(
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

  async function deleteExpense(id: string) {
    setIsDeleting(true);
    try {
      const response = await financialExpenseService.httpDeleteExpense(id);
      if (response.data) {
        toast.success('Expense deleted successfully');
        setShowDeleteModal(false);
        setData({
          ...data,
          expenses: data.expenses.filter((item) => item._id !== id),
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
        title="Expense"
        open={showDrawer}
        onClose={() => {
          setSelectedExpense(null);
          setShowDrawer(false);
        }}
        width={800}
        destroyOnClose
      >
        <ExpenseForm
          expense={selectedExpense ? selectedExpense : undefined}
          onSuccess={(newExpense) => {
            if (selectedExpense) {
              setData({
                ...data,
                expenses: data.expenses.map((item) => {
                  if (item._id === selectedExpense._id) {
                    return newExpense;
                  }
                  return item;
                }),
              });
            } else {
              setData({
                ...data,
                expenses: [newExpense, ...data.expenses],
              });
            }
            setShowDrawer(false);
            setSelectedExpense(null);
          }}
        />
      </Drawer>

      {selectedExpense && showDeleteModal ? (
        <ModalComponent
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          width="30%"
        >
          <DeleteContent
            onClick={() => {
              deleteExpense(selectedExpense._id);
            }}
            isLoading={isDeleting}
            onClose={() => setShowDeleteModal(false)}
          />
        </ModalComponent>
      ) : null}

      {showCollectModal && selectedExpense ? (
        <Drawer
          open={showCollectModal}
          onClose={() => {
            setSelectedExpense(null);
            setShowCollectModal(false);
          }}
          title="Make a Payment"
          width={800}
          destroyOnClose
        >
          <CollectExpensePayment
            expense={selectedExpense}
            onSuccess={(expense) => {
              setData({
                ...data,
                expenses: data.expenses.map((item) => {
                  if (item._id === selectedExpense._id) {
                    return expense;
                  }
                  return item;
                }),
              });
              setShowCollectModal(false);
              setSelectedExpense(null);
            }}
          />
        </Drawer>
      ) : null}

      <div className="flex justify-between items-center mb-4">
        <TertiaryHeading title="Expense" className="text-graphiteGray" />
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
                const expenses = _.filter(data.expenses, (item) =>
                  selectedRowKeys.includes(item._id)
                );
                if (!expenses.length) {
                  toast.error('No expenses selected');
                  return;
                }
                const excel = new Excel();
                excel
                  .addSheet('Expenses')
                  // exlcude file columns  as  well
                  .addColumns(columns.slice(0, columns.length - 2) as any)
                  .addDataSource(expenses)
                  .saveAs('Expenses.xlsx');
              }}
            />
          </div>
          <CustomButton
            text="Add Expense"
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
        dataSource={data.expenses.filter((item) => {
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

export default withAuth(Expense);
