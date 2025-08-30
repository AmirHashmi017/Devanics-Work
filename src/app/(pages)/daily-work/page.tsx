'use client';
import CustomButton from '@/app/component/customButton/button';
import WhiteButton from '@/app/component/customButton/white';
import { InputComponent } from '@/app/component/customInput/Input';
import { SelectComponent } from '@/app/component/customSelect/Select.component';
import TertiaryHeading from '@/app/component/headings/tertiary';
import { withAuth } from '@/app/hoc/withAuth';
import { SearchOutlined } from '@ant-design/icons';
import { Alert, Dropdown, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useRef, useState } from 'react';
import { DailyWorkForm } from './components/DailyWorkForm';
import * as Yup from 'yup';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useFormik } from 'formik';
import crmDailyWorkService, {
  ICrmDailyWorkCreate,
  ICrmDailyWorkUpdate,
} from '@/app/services/crm/crm-daily-work.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { DailyWorkDatePicker } from './components/DailyWorkDatePicker';
import {
  ICrmDailyWork,
  ICrmDailyWorkParsedData,
  IDailyWorkPriorty,
  IDailyWorkStatus,
} from '@/app/interfaces/crm/crm-daily-work.interface';
import Image from 'next/image';
import { InputWithoutBorder } from '@/app/component/customInput/InputWithoutBorder';
import { ManageStatus } from './components/ManageStatus';
import { ManagePriority } from './components/ManagePriority';
import { DisplayPriority } from './components/DisplayPriority';
import { DisplayDailyWorkStatus } from './components/DisplayStatus';
import ModalComponent from '@/app/component/modal';
import { DeleteContent } from '@/app/component/delete/DeleteContent';
import { Excel } from 'antd-table-saveas-excel';

import moment from 'moment';
import { PreviewCSVImportFileModal } from '../crm/components/PreviewCSVImportFileModal';

const ValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email'),
  phone: Yup.string().test({
    test: (value) => {
      if (value) {
        return isValidPhoneNumber(value);
      }
      return true;
    },
    message: 'Invalid phone number',
  }),
  work: Yup.string().required('Work Needed is required'),
  deadline: Yup.string(),
  note: Yup.string(),
});

function DailyWorkPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [parseData, setParseData] = useState<ICrmDailyWorkParsedData[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [parseDataError, setParseDataError] = useState('');
  const [isInsertingMany, setIsInsertingMany] = useState(false);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString());
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ICrmDailyWork[]>([]);
  const [statuses, setStatuses] = useState<IDailyWorkStatus[]>([]);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const [priorities, setPriorities] = useState<IDailyWorkPriorty[]>([]);
  const [isPriorityLoading, setIsPriorityLoading] = useState(false);

  const [priorityCellEditing, setPriorityCellEditing] = useState<{
    isEditing: boolean;
    record: ICrmDailyWork | null;
  }>({
    isEditing: false,
    record: null,
  });
  const [statusCellEditing, setIsStatusCellEditing] = useState<{
    isEditing: boolean;
    record: ICrmDailyWork | null;
  }>({
    isEditing: false,
    record: null,
  });

  const [noteCellEditing, setIsNoteCellEditing] = useState<{
    isEditing: boolean;
    record: ICrmDailyWork | null;
  }>({
    isEditing: false,
    record: null,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ICrmDailyWork | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // eslint-disable-next-line no-undef
  const priorityCellRef = useRef<HTMLTableDataCellElement | null>(null);
  // eslint-disable-next-line no-undef
  const statusCellRef = useRef<HTMLTableDataCellElement | null>(null);
  // eslint-disable-next-line no-undef
  const noteCellRef = useRef<HTMLTableDataCellElement | null>(null);

  useEffect(() => {
    getDailyWork(currentDate);
  }, [currentDate]);

  useEffect(() => {
    getDailyWorkStatus();
    getDailyWorkPriorities();
  }, []);

  const formik = useFormik<ICrmDailyWorkCreate | ICrmDailyWorkUpdate>({
    initialValues: {
      email: '',
      phone: '',
      work: '',
      deadline: '',
      note: '',
      status: '',
      priority: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: (values, helpers) => {
      if ('_id' in values) {
        setIsSubmitting(true);
        crmDailyWorkService
          .httpUpdatedailyLead(values._id, values)
          .then((response) => {
            if (response.data) {
              toast.success('Daily work updated successfully');
              setData(
                data.map((item) => {
                  if (item._id === response.data!._id) {
                    return response.data!;
                  }
                  return item;
                })
              );
              onClose();
              helpers.resetForm();
            }
          })
          .catch((error) => {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err.response?.data.message || 'An error occurred');
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      } else {
        createDailyWorkLead(values);
      }
    },
    enableReinitialize: true,
  });

  function getDailyWork(date: string) {
    setIsLoading(true);
    crmDailyWorkService
      .httpGetDailyWorkByDate(date)
      .then((response) => {
        if (response.data) {
          setData(response.data);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  async function createDailyWorkLead(values: ICrmDailyWorkCreate) {
    setIsSubmitting(true);
    try {
      const response = await crmDailyWorkService.httpCreateDailyWork(values);
      if (response.data) {
        toast.success('Daily work created successfully');
        setData([response.data, ...data]);
        setOpen(false);
        formik.resetForm();
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function getDailyWorkStatus() {
    setIsStatusLoading(true);
    crmDailyWorkService
      .httpGetAllDailyWorkStatus()
      .then((response) => {
        if (response.data) {
          setStatuses(response.data);
        }
      })
      .finally(() => {
        setIsStatusLoading(false);
      });
  }

  async function getDailyWorkPriorities() {
    setIsPriorityLoading(true);
    crmDailyWorkService
      .httpGetAllDailyWorkPriority()
      .then((response) => {
        if (response.data) {
          setPriorities(response.data);
        }
      })
      .finally(() => {
        setIsPriorityLoading(false);
      });
  }

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  const handleSave = async (
    key: string,
    value: string,
    record: ICrmDailyWork
  ) => {
    setPriorityCellEditing({
      isEditing: false,
      record: null,
    });
    setIsNoteCellEditing({
      isEditing: false,
      record: null,
    });
    setIsStatusCellEditing({
      isEditing: false,
      record: null,
    });

    priorityCellRef.current = null;
    noteCellRef.current = null;
    statusCellRef.current = null;

    setIsLoading(true);
    try {
      const response = await crmDailyWorkService.httpUpdatedailyLead(
        record._id,
        { ...record, [key]: value }
      );
      if (response.data) {
        toast.success('Daily work updated successfully');

        setData(
          data.map((item) => (item._id === record._id ? response.data! : item))
        );
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  async function deleteLead(id: string) {
    setIsDeleting(true);
    try {
      const response = await crmDailyWorkService.httpDeleteDailyWorkLead(id);
      if (response.data) {
        toast.success('Daily work deleted successfully');
        setData(data.filter((item) => item._id !== id));
        setShowDeleteModal(false);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: ColumnsType<ICrmDailyWork> = [
    {
      title: 'Priority',
      dataIndex: 'priority',
      render(_val, record) {
        if (!record.priority || typeof record.priority === 'string') {
          return 'Choose priority';
        }
        return (
          <div className="w-fit">
            <DisplayPriority item={record.priority} />
          </div>
        );
      },
      onCell: (record, rowIndex) => {
        return {
          inputType: 'priority',
          onClick: (e) => {
            e.stopPropagation();
            setPriorityCellEditing({
              isEditing: true,
              record,
            });
          },
          editing:
            priorityCellEditing.isEditing &&
            priorityCellEditing.record?._id === record._id
              ? true
              : false,
          priorities: priorities,
          handleSave,
          record,
          rowIndex,
          cellRef: priorityCellRef,
        };
      },
    },
    {
      title: 'Work Needed',
      dataIndex: 'work',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      render: (value) => {
        if (!value) {
          return null;
        }
        return moment(value).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Note',
      dataIndex: 'note',
      render(value: string) {
        if (!value) {
          return null;
        }
        const note = value.slice(0, 10);
        return note + (note.length > 10 ? '...' : '');
      },
      width: 200,
      onCell: (record, rowIndex) => {
        return {
          inputType: 'note',
          onClick: (e) => {
            e.stopPropagation();
            setIsNoteCellEditing(() => ({
              isEditing: true,
              record,
            }));
          },
          editing:
            noteCellEditing.isEditing &&
            noteCellEditing.record?._id === record._id
              ? true
              : false,
          handleSave,
          record,
          rowIndex,
          cellRef: noteCellRef,
        };
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(_val, record) {
        if (!record.status || typeof record.status === 'string') {
          return 'Choose status';
        }
        return <DisplayDailyWorkStatus item={record.status} />;
      },
      onCell: (record, rowIndex) => {
        return {
          inputType: 'status',
          onClick: (e) => {
            e.stopPropagation();
            setIsStatusCellEditing({
              isEditing: true,
              record,
            });
          },
          editing:
            statusCellEditing.isEditing &&
            statusCellEditing.record?._id === record._id
              ? true
              : false,
          statuses: statuses,
          handleSave,
          record,
          rowIndex,
          cellRef: statusCellRef,
        };
      },
    },
    {
      title: 'Action',
      render(_val, record) {
        return (
          <Dropdown
            menu={{
              items: [
                { key: 'edit', label: 'Edit' },
                { key: 'delete', label: 'Delete' },
              ],
              onClick: (e) => {
                if (e.key === 'edit') {
                  showDrawer();
                  formik.setValues({
                    deadline: record.deadline?.toString() || '',
                    email: record.email,
                    note: record.note,
                    phone: record.phone,
                    work: record.work,
                    _id: record._id,
                    priority: record.priority
                      ? typeof record.priority === 'string'
                        ? record.priority
                        : record.priority._id
                      : '',
                    status: record.status
                      ? typeof record.status === 'string'
                        ? record.status
                        : record.status._id
                      : '',
                  });
                } else if (e.key === 'delete') {
                  setShowDeleteModal(true);
                  setSelectedLead(record);
                }
              },
            }}
          >
            <Image
              src="/menuIcon.svg"
              alt="logo white icon"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </Dropdown>
        );
      },
    },
  ];

  function handleExport(dataset: ICrmDailyWork[]) {
    const excel = new Excel();

    excel
      .addSheet('Daily Work')
      .addColumns([
        {
          title: 'Priority',
          dataIndex: 'priority',
          render(_text, record) {
            if (typeof record.priority === 'string' || !record.priority) {
              return null;
            }
            return record.priority.name;
          },
        },

        {
          title: 'Work Needed',
          dataIndex: 'work',
        },
        {
          title: 'Phone Number',
          dataIndex: 'phone',
        },
        {
          title: 'Email',
          dataIndex: 'email',
        },
        {
          title: 'Note',
          dataIndex: 'note',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          render(_text, record) {
            if (typeof record.status === 'string' || !record.status) {
              return null;
            }
            return record.status.name;
          },
        },
      ])
      .addDataSource(dataset)
      .saveAs('Daily Work.xlsx');
  }

  const handleFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploadingFile(true);
      try {
        const file = files[0];
        const formData = new FormData();
        formData.append('file', file);
        const response =
          await crmDailyWorkService.httpUploadAndParseCSVFile(formData);
        if (response.data) {
          toast.success('File parsed successfully');
          setParseData(response.data);
          inputFileRef.current!.value = '';
        }
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        setParseDataError(err.response?.data.message || 'An error occurred');
      } finally {
        setIsUploadingFile(false);
      }
    }
  };

  async function handleInsertMany(parseData: ICrmDailyWorkParsedData[]) {
    setIsInsertingMany(true);
    try {
      const response = await crmDailyWorkService.httpInsertManyLeads(parseData);
      if (response.data) {
        toast.success('Data inserted successfully');
        setData([...response.data, ...data]);
        setParseData([]);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data.message || 'An error occurred');
    } finally {
      setIsInsertingMany(false);
    }
  }

  const filteredData = data
    .filter((item) => {
      if (!search) {
        return true;
      }
      return (
        item.work?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.phone?.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter((item) => {
      if (!statusFilter) {
        return true;
      }
      return typeof item.status === 'string'
        ? item.status === statusFilter
        : item.status?._id === statusFilter;
    })
    .filter((item) => {
      if (!priorityFilter) {
        return true;
      }
      return typeof item.priority === 'string'
        ? item.priority === priorityFilter
        : item.priority?._id === priorityFilter;
    });

  return (
    <section
      onClick={() => {
        setIsNoteCellEditing({
          isEditing: false,
          record: null,
        });

        setIsStatusCellEditing({
          isEditing: false,
          record: null,
        });

        setPriorityCellEditing({
          isEditing: false,
          record: null,
        });
      }}
      className="mt-6 !mb-[39px] bg-white p-5 min-h-[80%]  mx-4 rounded-xl "
    >
      <DailyWorkForm
        formik={formik}
        onClose={onClose}
        open={open}
        isSubmitting={isSubmitting}
        onSubmit={formik.handleSubmit}
        priorities={priorities}
        statuses={statuses}
      />

      {selectedLead && showDeleteModal ? (
        <ModalComponent
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          width="30%"
        >
          <DeleteContent
            onClick={() => {
              deleteLead(selectedLead._id);
            }}
            isLoading={isDeleting}
            onClose={() => setShowDeleteModal(false)}
          />
        </ModalComponent>
      ) : null}

      <PreviewCSVImportFileModal
        columns={columns as any}
        data={parseData}
        onClose={() => setParseData([])}
        onConfirm={() => {
          handleInsertMany(parseData);
        }}
        duplicates={[]}
        setData={setParseData}
        isLoading={isInsertingMany}
        title="Import Daily Work Leads"
      />

      <div className="flex justify-between items-center mb-3">
        <TertiaryHeading className={'mt-1 mb-2'} title="Daily Work Needed" />

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

          <SelectComponent
            label=""
            name=""
            placeholder="Priority"
            field={{
              options: priorities.map((item) => {
                return {
                  label: item.name,
                  value: item._id,
                };
              }),
              value: priorityFilter ? priorityFilter : undefined,
              onChange(value) {
                setPriorityFilter(value);
              },
              allowClear: true,
              onClear() {
                setPriorityFilter('');
              },
              dropdownStyle: {
                width: '200px',
              },
            }}
          />
          <SelectComponent
            label=""
            name=""
            placeholder="Status"
            field={{
              value: statusFilter ? statusFilter : undefined,
              options: statuses.map((item) => {
                return {
                  label: item.name,
                  value: item._id,
                };
              }),
              onChange: (value) => {
                setStatusFilter(value);
              },
              allowClear: true,
              onClear() {
                setStatusFilter('');
              },
              dropdownStyle: {
                width: '200px',
              },
            }}
          />

          <div>
            <WhiteButton
              text="Export"
              className="!w-fit !py-2.5"
              icon="/download-icon.svg"
              iconwidth={20}
              iconheight={20}
              onClick={() => handleExport(data)}
            />
          </div>
          <div>
            <WhiteButton
              text="Import"
              className="!w-fit !py-2.5"
              icon="/uploadcloud.svg"
              iconwidth={20}
              iconheight={20}
              loadingText="Uploading..."
              onClick={() => {
                inputFileRef.current?.click();
              }}
              isLoading={isUploadingFile}
            />
            <input
              ref={inputFileRef}
              accept=".csv, .xlsx"
              type="file"
              name=""
              id="daily-work-import"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* <div>
                        <WhiteButton
                            text="Invite"
                            className="!border-schestiPrimary !text-schestiPrimary"
                        />
                    </div> */}
          <CustomButton
            text="Add New Lead"
            className="!w-fit !py-2.5"
            icon="/plus.svg"
            iconwidth={20}
            iconheight={20}
            onClick={showDrawer}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <DailyWorkDatePicker value={currentDate} onChange={setCurrentDate} />

        <div className="flex items-center space-x-3">
          <ManagePriority
            priorities={priorities}
            onCreate={(priority) => {
              setPriorities([priority, ...priorities]);
            }}
            isFetching={isPriorityLoading}
            onUpdate={(priority) => {
              setPriorities(
                priorities.map((_priority) =>
                  _priority._id === priority._id ? priority : _priority
                )
              );
            }}
            onDelete={(priority) => {
              setPriorities(
                priorities.filter((_priority) => _priority._id !== priority._id)
              );
            }}
          />

          <ManageStatus
            statuses={statuses}
            onCreate={(status) => {
              setStatuses([status, ...statuses]);
            }}
            isFetching={isStatusLoading}
            onUpdate={(status) => {
              setStatuses(
                statuses.map((_status) =>
                  _status._id === status._id ? status : _status
                )
              );
            }}
            onDelete={(status) => {
              setStatuses(
                statuses.filter((_status) => _status._id !== status._id)
              );
            }}
          />
        </div>
      </div>

      <div className="mt-5">
        {parseDataError.length ? (
          <Alert
            type="error"
            closable
            onClose={() => {
              setParseDataError('');
            }}
            message={'CSV Parse Error '}
            description={parseDataError}
            className="my-3"
          />
        ) : null}
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          bordered
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          pagination={{
            position: ['bottomCenter'],
          }}
        />
      </div>
    </section>
  );
}

export default withAuth(DailyWorkPage);

type EditableCellProps = {
  editing: boolean;
  dataIndex: any;
  title: any;
  inputType: 'status' | 'priority' | 'note';
  record: any;
  rowIndex: any;
  statuses: IDailyWorkStatus[];
  priorities: IDailyWorkPriorty[];
  children: React.ReactNode;
  handleSave: (..._args: any) => void;
  // eslint-disable-next-line no-undef
  cellRef: React.RefObject<HTMLTableDataCellElement>;
  [key: string]: any;
};
function EditableCell(props: EditableCellProps) {
  const {
    editing,
    inputType,
    children,
    handleSave,
    record,
    cellRef,
    ...restProps
  } = props;

  const [note, setNote] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputType === 'note') {
      if (record.note) {
        setNote(record.note);
      }
      inputRef.current?.focus();
    }
  }, [editing, inputType, record?.note, cellRef]);

  return (
    <td {...restProps} ref={cellRef}>
      {editing && (inputType === 'priority' || inputType === 'status') ? (
        <div className="relative capitalize">
          <span className="font-medium">Choose {inputType}</span>
          <div className="absolute bg-white border rounded-md w-[200px] top-6 p-3 z-10 space-y-2">
            {inputType === 'priority'
              ? props.priorities.length === 0
                ? 'No Priority'
                : props.priorities.map((priority: IDailyWorkPriorty) => (
                    <DisplayPriority
                      onClick={(e) => {
                        console.log('Priority Clicked');
                        e.stopPropagation();
                        handleSave('priority', priority._id, record);
                      }}
                      key={priority._id}
                      item={priority}
                    />
                  ))
              : inputType === 'status'
                ? props.statuses.length === 0
                  ? 'No Stauses'
                  : props.statuses.map((status: IDailyWorkStatus) => (
                      <DisplayDailyWorkStatus
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSave('status', status._id, record);
                        }}
                        key={status._id}
                        item={status}
                      />
                    ))
                : null}
          </div>
        </div>
      ) : editing && inputType === 'note' ? (
        <InputWithoutBorder
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
          }}
          placeholder="Enter note"
          onBlur={(e) => {
            e.stopPropagation();
            // handleSave("note", note, record)
            setNote('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              handleSave('note', note, record);
              setNote('');
            }
          }}
          id="note"
          ref={inputRef}
          className="border-schestiPrimary border px-2 flex-1 rounded-md bg-transparent focus:outline-schestiPrimary py-2 "
        />
      ) : (
        children
      )}
    </td>
  );
}
