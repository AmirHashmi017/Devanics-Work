import { IDailyWork } from '../../modules/crm/daily-work-lead/daily-work.model';

type Analytics = {
  type: 'profit' | 'loss';
  value: number;
};

type ModuleRecord = {
  value: number;
  analytics?: Analytics;
};

export type IUserDashboardAnalytics = {
  dashboardConstruction: {
    estimate: ModuleRecord;
    takeoff: ModuleRecord;
    schedule: ModuleRecord;
    bids: ModuleRecord;
    contracts: ModuleRecord;
  };
  preconstruct: {
    takeoff: number[];
    estimate: number[];
    schedule: number[];
    bids: number[];
  };
  dailyLeads: IDailyWork[];
  meetings: {
    total: number;
  };

  bidManagement: {
    analytics?: Analytics;
    total: number;
    active: {
      value: number;
    };
    archived: {
      value: number;
    };
    draft: {
      value: number;
    };
  };

  finance: {
    analytics?: Analytics;
    total: number;
    aiaInvoicing: {
      value: number;
      total: number;
    };
    standardInvoicing: {
      value: number;
      total: number;
    };
    expenses: {
      value: number;
      total: number;
    };
  };

  crm: {
    client: {
      active: number;
      inactive: number;
      total: number;
    };
    contractor: {
      active: number;
      inactive: number;
      total: number;
    };
    subContractor: {
      active: number;
      inactive: number;
      total: number;
    };
    partner: {
      active: number;
      inactive: number;
      total: number;
    };
    architect: {
      active: number;
      inactive: number;
      total: number;
    };
    vendor: {
      active: number;
      inactive: number;
      total: number;
    };

    analytics?: Analytics;
  };

  estimateReport: {
    won: {
      value: number;
    };
    lost: {
      value: number;
    };
    active: {
      value: number;
    };
    poorQualification: {
      value: number;
    };
  };

  socialMedia: {
    comments: {
      analytics?: Analytics;
      value: number;
    };
    shares: {
      analytics?: Analytics;
      value: number;
    };
    likes: {
      analytics?: Analytics;
      value: number;
    };
    impressions: {
      analytics?: Analytics;
      value: number;
    };
  };
};

export type UserDashboardKey =
  | 'dashboardConstruction.estimate'
  | 'dashboardConstruction.bids'
  | 'dashboardConstruction.schedule'
  | 'dashboardConstruction.takeoff'
  | 'dashboardConstruction.contracts'
  | 'preconstruct'
  | 'dailyLeads'
  | 'bidManagement'
  | 'finance'
  | 'crm'
  | 'estimateReport'
  | 'socialMedia.comments'
  | 'socialMedia.shares'
  | 'socialMedia.likes'
  | 'socialMedia.impressions';
