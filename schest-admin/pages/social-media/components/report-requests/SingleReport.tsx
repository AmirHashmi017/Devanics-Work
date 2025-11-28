import { Dropdown, MenuProps } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userService } from 'src/services/user.service';

const SingleReport = (reportData: IReport) => {
  const { commentId, type, reason, description, createdAt } = reportData;

  const { name: reporterName } = reportData?.reportedBy || {};
  const { _id: postId, associatedCompany = {} } = reportData?.post || {};

  const { name = '', _id = '' } = associatedCompany as AssociatedCompany;

  const navigate = useNavigate();
  const postMenuItems: MenuProps['items'] = [
    {
      key: 'view-user',
      label: (
        <p>
          {' '}
          <span className="mr-1 size-4">
            <img src="assets/icons/avatar-mini.svg" alt="avatar" />
          </span>{' '}
          View User
        </p>
      ),
    },
    {
      key: type === 'comment' ? 'view-comment' : 'view-post',
      label: (
        <p>
          <span className="mr-1 size-4">
            <img src="assets/icons/eye.svg" alt="eye" />
          </span>{' '}
          {type === 'comment' ? 'View Reported Comment' : 'View reported post'}
        </p>
      ),
    },
    {
      key: 'block-user',
      label: (
        <p>
          {' '}
          <span className="mr-1 size-4">
            <img src="assets/icons/caution.svg" alt="caution" />
          </span>
          Block User
        </p>
      ),
    },
  ];

  const handlePostDropdownClick = async (key: string) => {
    if (key === 'view-user') {
      navigate(`/user/${_id}`);
    } else if (key === 'view-post') {
      navigate(`/social-media/post/${postId}`);
    } else if (key === 'view-comment') {
      navigate(`/social-media/post/${postId}/${commentId}`);
    } else {
      const data = await userService.httpBlockEmployee(_id);
      toast.warning(data.message);
    }
  };

  return (
    <section className="w-full grid grid-cols-6 gap-5 shadow relative rounded-xl p-4 pr-10 bg-white">
      <div className="flex col-span-1 gap-3">
        <img
          src="/assets/icons/profileAvatar.png"
          className="size-11 rounded-full"
          alt=""
        />
        <div>
          <p className="text-monsson text-[10px]">Reported User:</p>
          <p className="text-sm font-semibold text-ebonyClay mt-2">{name}</p>
        </div>
      </div>
      <div className="reason-section col-span-1">
        <p className="text-[10px] text-monsoon">Reported Category:</p>
        <div className="flex gap-3 mt-2">
          <p className="bg-veryLightPink text-center text-goldDrop rounded-2xl py-0.5 px-2 font-medium text-xs">
            {reason}
          </p>
        </div>
      </div>
      <div className="report-time  col-span-1">
        <p className="text-[10px] text-monsoon">Report Time:</p>
        <p className="mt-2 font-medium text-ebonyClay text-xs">
          {moment(createdAt).format('MM-DD-YYYY')}
        </p>
      </div>
      <div className="report-time  col-span-1">
        <p className="text-[10px] text-monsoon">Type:</p>
        <p className="mt-2 font-medium text-ebonyClay text-xs capitalize">
          {type || 'Post'}
        </p>
      </div>
      <div className="reported-by  col-span-1">
        <p className="text-[10px] text-monsoon">Repoted by:</p>
        <div className="flex mt-2 gap-3 items-center">
          <img
            src="/assets/icons/profileAvatar.png"
            alt=""
            className="rounded-full size-6"
          />
          <p className="text-ebonyClay text-xs">{reporterName}</p>
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex gap-4 justfiy-between">
          <div>
            <p className="text-[10px] text-monsoon">Reason</p>
            <p className="mt-2 text-xs text-ebonyClay line-clamp-2">
              {description}
            </p>
          </div>
          <Dropdown
            menu={{
              items: postMenuItems,
              onClick: (event) => {
                const { key } = event;
                handlePostDropdownClick(key);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              },
            }}
            className="absolute top-2 right-4 text-2xl"
            placement="bottomRight"
          >
            <img
              src={'assets/icons/menuIcon.svg'}
              alt="logo white icon"
              className="active:scale-105 cursor-pointer size-5"
            />
          </Dropdown>
        </div>
      </div>
    </section>
  );
};

export default SingleReport;

export interface IReport {
  _id: string;
  postId: string;
  commentId: string;
  reportedBy: ReportedBy;
  __v: number;
  createdAt: string;
  description: string;
  reason: string;
  updatedAt: string;
  type: string;
  post: Post;
}

export interface ReportedBy {
  _id: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  isActive: string;
  loginAttempts: number;
  providerId: string;
  providerType: string;
  name: string;
  roles: any[];
  userRole: string;
  brandingColor: string;
  isPaymentConfirm: boolean;
  selectedTrades: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  address: string;
  city: string;
  companyLogo: any;
  companyName: string;
  country: string;
  industry: string;
  organizationName: string;
  phone: string;
  state: string;
  planId: string;
  stripeCustomerId: string;
  subscriptionId: string;
}

export interface Post {
  _id: string;
  description: string;
  feeling: any;
  associatedCompany: AssociatedCompany;
  mediaFiles: any[];
  reactions: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AssociatedCompany {
  _id: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  isActive: string;
  loginAttempts: number;
  providerId: string;
  providerType: string;
  name: string;
  roles: any[];
  userRole: string;
  brandingColor: string;
  isPaymentConfirm: boolean;
  selectedTrades: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  address: string;
  city: string;
  companyLogo: any;
  companyName: string;
  country: string;
  industry: string;
  organizationName: string;
  phone: string;
  state: string;
  planId: string;
  stripeCustomerId: string;
  subscriptionId: string;
}
