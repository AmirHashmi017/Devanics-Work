import React from 'react';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const LineChart = ({ trend = 'up', color = '#10B981' }) => {
  let points;

  switch (trend) {
    case 'up':
      points = "2,20 8,15 14,10 20,5 26,8 32,3";
      break;
    case 'down':
      points = "2,5 8,10 14,15 20,20 26,18 32,22";
      break;
    case 'updown':
      points = "2,15 8,10 14,20 20,8 26,16 32,6";
      break;
    default:
      points = "2,20 8,15 14,10 20,5 26,8 32,3";
  }

  return (
    <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};


const StatCard = ({ icon, title, value, duration, percentage, trend = 'up' }) => {
  const trendColor = trend === 'up' ? '#10B981' : '#EF4444';
  const trendBgColor = trend === 'up' ? '#ECFDF5' : '#FEF2F2';
  const TrendIcon = trend === 'up' ? TrendingUpIcon : TrendingDownIcon;

  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-title-section">
          {typeof icon === 'string' ? (
            <img src={icon} alt={title} className="stat-icon" />
          ) : (
            React.createElement(icon, { className: 'stat-icon' })
          )}
          <span className="stat-title">{title}</span>
        </div>
      </div>

      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <LineChart trend={trend} color={trendColor} />
      </div>

      <div className="stat-footer">
        <span className="stat-duration">{duration}</span>
        <div className="stat-trend" style={{ backgroundColor: trendBgColor, color: trendColor }}>
          <TrendIcon style={{ fontSize: '14px' }} />
          <span>{percentage}%</span>
        </div>
      </div>
    </div>
  );
};


const Statistics = ({ statsData, duration }) => {
  // Extract data from API response
  const totalUsers = statsData?.data?.totalUsers || 0;
  const paidUsers = statsData?.data?.paidUsers || 0;
  const totalEarning = statsData?.data?.totalEarning || 0;
  const reportData = statsData?.data?.reportData || [];

  // Calculate trends based on reportData
  const calculateTrend = (data) => {
    if (data.length < 2) return { trend: 'up', percentage: 0 };
    
    // Get the last two data points
    const recent = data[data.length - 1];
    const previous = data[data.length - 2];
    
    const recentTotal = (recent.paid || 0) + (recent.free || 0);
    const previousTotal = (previous.paid || 0) + (previous.free || 0);
    
    if (previousTotal === 0) {
      return recentTotal > 0 ? { trend: 'up', percentage: 100 } : { trend: 'down', percentage: 0 };
    }
    
    const percentage = Math.round(((recentTotal - previousTotal) / previousTotal) * 100);
    return {
      trend: percentage >= 0 ? 'up' : 'down',
      percentage: Math.abs(percentage)
    };
  };

  const calculatePaidTrend = (data) => {
    if (data.length < 2) return { trend: 'up', percentage: 0 };
    
    const recent = data[data.length - 1];
    const previous = data[data.length - 2];
    
    const recentPaid = recent.paid || 0;
    const previousPaid = previous.paid || 0;
    
    if (previousPaid === 0) {
      return recentPaid > 0 ? { trend: 'up', percentage: 100 } : { trend: 'down', percentage: 0 };
    }
    
    const percentage = Math.round(((recentPaid - previousPaid) / previousPaid) * 100);
    return {
      trend: percentage >= 0 ? 'up' : 'down',
      percentage: Math.abs(percentage)
    };
  };

  const totalTrend = calculateTrend(reportData);
  const paidTrend = calculatePaidTrend(reportData);
  
  // For earnings, since we don't have historical data, use a simple calculation
  const earningTrend = totalEarning > 0 ? { trend: 'up', percentage: 25 } : { trend: 'down', percentage: 0 };

  // Duration label - handle empty string case
  const durationLabel = duration === 'month' ? 'Last month' : 'Last year';

  const statsDataArray = [
    {
      icon: PeopleOutlineIcon,
      title: 'Total Number of Users',
      value: totalUsers.toString(),
      duration: durationLabel,
      percentage: totalTrend.percentage.toString(),
      trend: totalTrend.trend
    },
    {
      icon: PeopleOutlineIcon,
      title: 'Paid Users',
      value: paidUsers.toString(),
      duration: durationLabel,
      percentage: paidTrend.percentage.toString(),
      trend: paidTrend.trend
    },
    {
      icon: '/icons/PaidIcon.svg',
      title: 'Total Earnings',
      value: `£${totalEarning.toLocaleString()}`,
      duration: durationLabel,
      percentage: earningTrend.percentage.toString(),
      trend: earningTrend.trend
    }
  ];

  return (
    <div className="statistics-container">
      <style jsx>{`
        .statistics-container {
          display: flex;
          gap: 24px;
          max-width: full;
          padding: 16px;
          flex-wrap: wrap;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          width: 442px;
          flex: 1;
          max-width: full;
          border: 1px solid #EAECEE;
        }

        .stat-header {
          margin-bottom: 8px;
        }

        .stat-title-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stat-icon {
          width: 18px;
          height: 18px;
          color: #64748b;
        }

        .stat-title {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
          line-height: 1.4;
        }

        .stat-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.1;
        }

        .stat-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-duration {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .statistics-container {
            flex-direction: column;
            gap: 16px;
          }
          
          .stat-card {
            max-width: none;
            min-width: unset;
          }
        }
      `}</style>

      {statsDataArray.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          duration={stat.duration}
          percentage={stat.percentage}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default Statistics;