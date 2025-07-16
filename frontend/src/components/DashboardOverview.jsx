import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import './DashboardOverview.css';

const DashboardOverview = ({ totalSpending, transactionCount, categoryCount }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const stats = [
    {
      title: '총 지출',
      value: formatCurrency(Math.abs(totalSpending)),
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500'
    },
    {
      title: '거래 건수',
      value: transactionCount.toLocaleString(),
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      title: '카테고리',
      value: categoryCount.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      title: '평균 지출',
      value: formatCurrency(transactionCount > 0 ? Math.abs(totalSpending) / transactionCount : 0),
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    }
  ];

  return (
    <div className="dashboard-overview">
      <div className="overview-header">
        <h2 className="overview-title">대시보드 개요</h2>
        <p className="overview-subtitle">가계부 현황을 한눈에 확인하세요</p>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <div className={`stat-icon-container ${stat.bgColor}`}>
                <stat.icon className={`stat-icon ${stat.iconColor}`} />
              </div>
              <div className="stat-details">
                <p className="stat-title">{stat.title}</p>
                <p className={`stat-value ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;