import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, Table } from 'antd';
import moment from 'moment';
import { toast } from 'react-toastify';

import type { ColumnsType } from 'antd/es/table';
import { bg_style } from 'src/components/TailwindVariables';
import TertiaryHeading from 'src/components/Headings/Tertiary';
import { selectToken } from 'src/redux/authSlices/auth.selector';
import { HttpService } from 'src/services/base.service';
import CustomButton from 'src/components/CustomButton/button';
import ModalComponent from 'src/components/customModal';
import { DeleteContent } from 'src/components/deleteConfirmation';
import { useNavigate } from 'react-router-dom';
import { adService } from 'src/services/ad.service';
import { IAdManagement } from 'src/interfaces/ad.interface';
import _ from 'lodash';

const AdManagmentTable = () => {
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(true);
  const [ads, setAds] = useState<IAdManagement[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any | null>(null);

  const fetchedAllAdsHandler = useCallback(async () => {
    let result = await adService.httpGetAllAds();
    setIsLoading(false);
    setAds(result?.data?.ads!);
  }, []);

  useEffect(() => {
    fetchedAllAdsHandler();
  }, []);

  useLayoutEffect(() => {
    if (token) {
      HttpService.setToken(token);
    }
  }, [token]);

  const deleteAdHandler = async () => {
    await adService
      .httpDeleteAdById(selectedAd._id)
      .then((res) => {
        const newAds = ads.filter((ad) => ad._id !== selectedAd._id);
        setAds(newAds);
        setShowDeleteModal(false);
        toast.success('Ad Deleted Successfully');
      })
      .catch((errr) => {
        toast.error('Unable to delete Ad');
      });
  };

  const deleteItemHandler = (selectedAd: any) => {
    setSelectedAd(selectedAd);
    setShowDeleteModal(true);
  };

  const columns: ColumnsType<IAdManagement> = [
    {
      title: 'Client',
      dataIndex: 'clientName',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render(value) {
        return `${value} Seconds`;
      },
    },

    {
      title: 'Start',
      dataIndex: 'startDate',
      render(value) {
        return moment(value).format('DD-MM-YYYY');
      },
    },

    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      render(value) {
        return moment(value).format('DD-MM-YYYY');
      },
    },
    {
      title: 'Image',
      dataIndex: 'imageURL',
      width: 150,
      render(value) {
        return _.slice(value, 0, 20);
      },
    },

    {
      title: 'Action',
      dataIndex: 'action',
      align: 'center',
      key: 'action',
      render: (_, categoryData: IAdManagement) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: (
                  <p
                    onClick={() => {
                      navigate(`/ad-managment/update/${categoryData._id}`);
                    }}
                  >
                    Edit
                  </p>
                ),
              },
              {
                key: 'delete',
                label: (
                  <p onClick={() => deleteItemHandler(categoryData)}>Delete</p>
                ),
              },
              {
                key: 'view',
                label: (
                  <p
                    onClick={() => {
                      navigate(`/ad-managment/view/${categoryData._id}`);
                    }}
                  >
                    View
                  </p>
                ),
              },
            ],
          }}
        >
          <div className="flex justify-center">
            <img
              src="/assets/icons/moreOptions.svg"
              className="cursor-pointer h-6 w-6"
              width={20}
              height={20}
              alt="edit"
            />
          </div>
        </Dropdown>
      ),
    },
  ];

  return (
    <div
      className={`${bg_style} border border-solid border-silverGray mt-4 p-5`}
    >
      <div className="flex justify-between items-center mb-4">
        <TertiaryHeading title="Ad Management" className="text-graphiteGray" />
        <CustomButton
          text="Add New"
          className="!w-auto "
          icon="assets/icons/plus.svg"
          iconwidth={20}
          iconheight={20}
          onClick={() => {
            navigate('/ad-managment/create');
          }}
        />
      </div>
      <Table
        loading={isLoading}
        columns={columns}
        className="mt-4"
        dataSource={ads}
        pagination={{ position: ['bottomCenter'] }}
        scroll={{
          x: 1000,
        }}
      />

      <ModalComponent
        open={showDeleteModal}
        setOpen={setShowDeleteModal}
        width="30%"
      >
        <DeleteContent
          onClick={deleteAdHandler}
          onClose={() => setShowDeleteModal(false)}
        />
      </ModalComponent>
    </div>
  );
};

export default AdManagmentTable;
