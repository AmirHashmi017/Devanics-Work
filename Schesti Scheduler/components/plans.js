import _ from 'lodash';
import { BidIcon } from './component-icons/BidIcon';
import { CRMIcon } from './component-icons/CrmIcon';
import { QuantityIcon } from './component-icons/QuantityIcon';
import { EstimateIcon } from './component-icons/EstimateIcon';
import { FinancialIcon } from './component-icons/FinancialIcon';
import { ScheduleIcon } from './component-icons/ScheduleIcon';
import { MeetingIcon } from './component-icons/MeetingIcon';
import { NetworkingIcon } from './component-icons/NetworkIcon';
import { SocialIcon } from './component-icons/SocialIcon';
import { ContractIcon } from './component-icons/ContractsIcon';
import { DailyWorkIcon } from './component-icons/DailyWorkIcon';

export const Routes = {
  'Bid Management': {
    Posted_Projects: '/bid-management/projects',
    Contractor: '/bid-management/contractor',
    'Sub-Contractor': '/bid-management/sub-contractor',
    Submit: '/bid-management/submit',
    Bidding_Projects: '/bid-management/bids',
    Post_A_Project: '/bid-management/post',
  },
  CRM: {
    Clients: '/crm/clients',
    'Sub-Contractors': '/crm/sub-contractors',
    Partners: '/crm/partners',
    Architects: '/crm/architects',
    Vendors: '/crm/vendors',
    Contractors: '/crm/contractors',
  },
  Contracts: '/contracts',
  'Quantity-Takeoff': {
    Manual: '/take-off',
    'AI-Takeoff': '#',
  },
  Estimates: {
    'Estimates-Requests': '/estimates/requests',
    'Estimates-List': '/estimates/generate',
  },
  Financial: {
    'Financial-Tools': '/financial/tools',
    'Standard-Invoicing': '/financial/standard-invoicing',
    'AIA-Invoicing': '/financial/aia-invoicing',
    Expense: '/financial/expense',
    Assets: '/financial/assets',
    Statement: '/financial/statement',
  },
  Schedule: '/',
  // Schedule: '/schedule',
  Meetings: '/meeting',
  Networking: '/networking',
  SocialMedia: '/social-media',
  Daily_Work: '/daily-work',
};

export const OtherRoutes = {
  Settings: {
    General: '/settings/general',
    Plans: '/settings/plans',
    'Category Setup': '/settings/CategorySetup',
    'User Managements': '/settings/companyUser',
    Materials: '/settings/materials',
    Target: '/settings/target',
    'Support Tickets': '/settings/supporttickets',
    Company_Roles: '/settings/companyUser/roles',
    Verification: '/settings/verification',
    Trades: '/settings/trades',
    Currency: '/settings/currency',
  },
  Upgrades: '/upgradeplans',
  Dashboard: '/dashboard',
  NEW_Dashboard: '/new-dashboard',
  // Contracts: '/contracts',
  DailyWork: '/daily-work',
  Social_Media: '/social-media',
};

export const Plans = {
  'Bid Management': '/bid-management',
  CRM: '/crm',
  'Quantity-Takeoff': '/takeoff',
  Estimates: '/estimates',
  Financial: '/financial',
  Schedule: '/schedule',
  Meetings: '/meeting',
  Networking: '/networking',
  Contracts: '/contracts',
  'Social Media': '/social-media',
  'Daily Work': '/daily-work',
};

export const planFeatureOptions = [
  {
    label: 'Bid Management',
    Icon: BidIcon,
    value: '/bid-management',
    title: 'Bid Management',
    options: [
      {
        label: 'Find Project',
        children: [
          { label: 'Contractor', value: Routes['Bid Management'].Contractor },
          {
            label: 'Sub Contractor',
            value: Routes['Bid Management']['Sub-Contractor'],
          },
        ],
      },
      {
        label: 'Bidding Projects',
        value: Routes['Bid Management'].Bidding_Projects,
      },
      {
        label: 'Posted Projects',
        value: Routes['Bid Management'].Posted_Projects,
      },
      {
        label: 'Post a project',
        value: Routes['Bid Management'].Post_A_Project,
        isAction: true,
      },
    ],
  },

  {
    title: 'CRM',
    Icon: CRMIcon,
    label: 'CRM',
    value: '/crm',
    options: [
      { label: 'Clients', value: Routes.CRM.Clients },
      { label: 'Sub Contractors', value: Routes.CRM['Sub-Contractors'] },
      { label: 'Partners', value: Routes.CRM.Partners },
      { label: 'Contractors', value: Routes.CRM.Contractors },
      { label: 'Architects', value: Routes.CRM.Architects },
      { label: 'Vendors', value: Routes.CRM.Vendors },
    ],
  },
  {
    Icon: DailyWorkIcon,
    label: 'Daily Work',
    value: Routes.Daily_Work,
  },
  {
    Icon: ContractIcon,
    label: 'Contracts',
    value: Routes.Contracts,
  },

  {
    // title: 'Quantity Takeoff',
    Icon: QuantityIcon,
    label: 'Quantity Takeoff',
    value: '/take-off',
    // options: [
    //   { label: 'Manual', value: Routes['Quantity-Takeoff'].Manual },
    //   { label: 'AI Takeoff', value: Routes['Quantity-Takeoff']['AI-Takeoff'] },
    // ],
  },

  {
    title: 'Estimates',
    Icon: EstimateIcon,
    label: 'Estimates',
    value: '/estimates',
    options: [
      {
        label: 'Estimates Requests',
        value: Routes.Estimates['Estimates-Requests'],
      },
      { label: 'Estimates List', value: Routes.Estimates['Estimates-List'] },
    ],
  },

  {
    title: 'Financial',
    Icon: FinancialIcon,
    label: 'Financial',
    value: '/financial',
    options: [
      {
        label: 'Standard Invoicing',
        value: Routes.Financial['Standard-Invoicing'],
      },
      { label: 'AIA Invoicing', value: Routes.Financial['AIA-Invoicing'] },
      { label: 'Financial Tools', value: Routes.Financial['Financial-Tools'] },
      { label: 'Expense', value: Routes.Financial['Expense'] },
      { label: 'Assets/Inventory', value: Routes.Financial['Assets'] },
      { label: 'Financial Statement', value: Routes.Financial['Statement'] },
    ],
  },

  {
    label: 'Schedule',
    Icon: ScheduleIcon,
    value: Routes.Schedule,
  },

  {
    label: 'Meetings',
    Icon: MeetingIcon,
    value: Routes.Meetings,
  },

  {
    label: 'Networking',
    Icon: NetworkingIcon,
    value: Routes.Networking,
  },
  {
    label: 'Social Media',
    Icon: SocialIcon,
    value: Routes.SocialMedia,
  },
];


export function getPlanFeatureKeyByValue(value, options = Plans) {
  const key = _.findKey(options, (val) => val === value);
  return key ? key : '';
}

export function getRouteFromPermission(permission) {
  for (const category in Routes) {
    if (typeof Routes[category] === 'object') {
      const subRoutes = Routes[category];
      for (const subRoute in subRoutes) {
        if (subRoutes[subRoute].includes(permission)) {
          return subRoutes[subRoute];
        }
      }
    } else {
      if (
        Routes[category].toString().includes(permission)
      ) {
        return Routes[category];
      }
    }
  }
  return undefined;
}
