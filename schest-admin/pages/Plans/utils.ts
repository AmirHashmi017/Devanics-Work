export const Routes = {
  'Bid Management': '/bid-management',
  CRM: '/crm',
  Contracts: '/contracts',
  'Quantity-Takeoff': '/take-off',
  Estimates: '/estimates',
  Proposals: '/proposal',
  Financial: '/financial',
  Schedule: '/schedule',
  Meetings: '/meeting',
  Networking: '/networking',
  User_Management: {
    Contractor: '/users/contractor',
    Subcontractor: '/users/subcontractor',
    Vendor: '/users/vendor',
    Architect: '/users/architect',
    Professor: '/users/professor',
    Student: '/users/student',
    Owner: '/users/owner',
    View_Info: '/users/view',
    Add_User: '/users/form',
  },
  Email_Notification: {
    List: '/email-notification',
    Create: '/email-notification/create',
    Edit: '/email-notification/edit',
    Preview: '/email-notification/preview',
  },
};
export const featureOptions = [
  {
    label: 'Bid Management',
    value: Routes['Bid Management'],
  },
  {
    label: 'Contracts',
    value: Routes.Contracts,
  },
  {
    label: 'CRM',
    value: Routes.CRM,
  },

  {
    label: 'Quantity Takeoff',
    value: Routes['Quantity-Takeoff'],
  },

  {
    label: 'Estimates',
    value: Routes.Estimates,
  },
  {
    label: 'Proposals',
    value: Routes.Proposals,
  },

  {
    label: 'Financial',
    value: Routes.Financial,
  },

  {
    label: 'Schedule',
    value: Routes.Schedule,
  },

  {
    label: 'Meetings',
    value: Routes.Meetings,
  },

  {
    label: 'Networking',
    value: Routes.Networking,
  },
  {
    label: 'Social Media',
    value: '/social-media',
    disabled: true,
  },
  {
    label: 'Daily Work',
    value: '/daily-work',
    disabled: true,
  },
];

export function getKeyByValue(
  options: Array<{
    label: string;
    value: string;
    options?: Array<{ label: string; value: string }> | undefined;
    title?: string;
  }>,
  value: string
) {
  for (const option of options) {
    if (option.options) {
      for (const subOption of option.options) {
        if (subOption.value === value) {
          return `${option.title} - ${subOption.label}`;
        }
      }
    } else if (option.value === value) {
      return option.label;
    }
  }
  return '';
}
