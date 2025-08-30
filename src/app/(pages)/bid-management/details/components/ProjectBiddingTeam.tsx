import TertiaryHeading from '@/app/component/headings/tertiary';
import { Table } from 'antd';
import { IBidManagement } from '@/app/interfaces/bid-management/bid-management.interface';
import { bidManagementService } from '@/app/services/bid-management.service';
import { useQuery } from 'react-query';

interface IProps {
  projectData: IBidManagement | any;
}

export function ProjectBiddingTeam(props: IProps) {
  const { projectData } = props;

  const fetchBiddingTeam = async () => {
    return bidManagementService.httpGetProjectBiddingTeamByProjectId(
      projectData._id
    );
  };

  const { data, isLoading }: any = useQuery(
    ['project-bidding-team'],
    fetchBiddingTeam
  );

  if (isLoading) return <h5>Loading...</h5>;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];
  return (
    <div className=" mt-6 mb-4 md:ms-[69px] md:me-[59px] mx-4  p-5 bg-white rounded-lg border shadow-lg">
      <div>
        <TertiaryHeading
          title="Bidding Team"
          className="text-[20px] leading-[30px]"
        />
      </div>

      <div className="mt-5">
        <Table
          columns={columns}
          bordered
          dataSource={data?.data?.biddingTeam.map((item: any) => ({
            name: item.user?.name,
            role: item.user?.userRole,
            companyName:
              item.user?.companyName || item.user?.organizationName || '',
            location: item.user?.address || '',
            phoneNumber: item.user?.phone || '',
            email: item.user?.email,
          }))}
        />
      </div>
    </div>
  );
}
