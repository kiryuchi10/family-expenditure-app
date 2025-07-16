import React, { useState } from 'react';
import { PieChart, BarChart3, Eye, EyeOff, Settings } from 'lucide-react';
import './SpendingChart.css';

const SpendingChart = ({ categories, totalSpending }) => {
  const [viewType, setViewType] = useState('pie');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hiddenCategories, setHiddenCategories] = useState(new Set());

  // Process categories data
  const processedCategories = categories
    .filter(cat => !hiddenCategories.has(cat.id))
    .map(cat => ({
      ...cat,
      percentage: totalSpending > 0 ? (Math.abs(cat.spending || 0) / Math.abs(totalSpending)) * 100 : 0
    }))
    .sort((a, b) => Math.abs(b.spending || 0) - Math.abs(a.spending || 0));

  const toggleCategoryVisibility = (categoryId) => {
    const newHidden = new Set(hiddenCategories);
    if (newHidden.has(categoryId)) {
      newHidden.delete(categoryId);
    } else {
      newHidden.add(categoryId);
    }
    setHiddenCategories(newHidden);
  };

  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c',
    '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
    '#fa709a', '#fee140', '#a8edea', '#fed6e3'
  ];

  const renderPieChart = () => {
    if (processedCategories.length === 0) {
      return (
        <div className="empty-state">
          <PieChart className="empty-icon" />
          <p className="empty-text">표시할 데이터가 없습니다</p>
        </div>
      );
    }

    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    let currentAngle = 0;

    return (
      <div className="pie-chart-container">
        <svg className="pie-chart-svg" viewBox="0 0 300 300">
          {processedCategories.map((category, index) => {
            const angle = (category.percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            currentAngle += angle;

            return (
              <path
                key={category.id}
                d={pathData}
                fill={colors[index % colors.length]}
                className={`pie-slice ${selectedCategory === category.id ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            );
          })}
        </svg>
        
        {selectedCategory && (
          <div className="category-tooltip">
            {(() => {
              const category = processedCategories.find(c => c.id === selectedCategory);
              return category ? (
                <>
                  <h4>{category.big_category}</h4>
                  <p>{Math.abs(category.spending || 0).toLocaleString('ko-KR')}원</p>
                  <span>{category.percentage.toFixed(1)}%</span>
                </>
              ) : null;
            })()}
          </div>
        )}
      </div>
    );
  };

  const renderBarChart = () => {
    if (processedCategories.length === 0) {
      return (
        <div className="empty-state">
          <BarChart3 className="empty-icon" />
          <p className="empty-text">표시할 데이터가 없습니다</p>
        </div>
      );
    }

    const maxSpending = Math.max(...processedCategories.map(c => Math.abs(c.spending || 0)));

    return (
      <div className="bar-chart-container">
        {processedCategories.map((category, index) => (
          <div key={category.id} className="bar-item">
            <div className="bar-info">
              <span className="bar-label">{category.big_category}</span>
              <span className="bar-amount">
                {Math.abs(category.spending || 0).toLocaleString('ko-KR')}원
              </span>
            </div>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: `${(Math.abs(category.spending || 0) / maxSpending) * 100}%`,
                  background: colors[index % colors.length],
                  animationDelay: `${index * 0.1}s`
                }}
              />
            </div>
            <div className="bar-percentage">
              {category.percentage.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="spending-chart-container">
      <div className="chart-header">
        <div className="header-left">
          <div className="title-section">
            <PieChart className="title-icon" />
            <h2 className="chart-title">지출 분석</h2>
          </div>
          <p className="chart-subtitle">카테고리별 지출 현황을 확인하세요</p>
        </div>
        
        <div className="chart-controls">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewType === 'pie' ? 'active' : ''}`}
              onClick={() => setViewType('pie')}
            >
              <PieChart className="toggle-icon" />
              <span>파이 차트</span>
            </button>
            <button
              className={`toggle-btn ${viewType === 'bar' ? 'active' : ''}`}
              onClick={() => setViewType('bar')}
            >
              <BarChart3 className="toggle-icon" />
              <span>막대 차트</span>
            </button>
          </div>
        </div>
      </div>

      <div className="chart-content">
        <div className="chart-visualization">
          {viewType === 'pie' ? renderPieChart() : renderBarChart()}
        </div>

        <div className="chart-legend">
          <h3 className="legend-title">
            <Settings className="legend-icon" />
            카테고리 목록
          </h3>
          <div className="legend-items">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className={`legend-item ${selectedCategory === category.id ? 'selected' : ''} ${
                  hiddenCategories.has(category.id) ? 'hidden' : ''
                }`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
              >
                <div className="legend-info">
                  <div className="legend-item-info">
                    <div
                      className="legend-color"
                      style={{ background: colors[index % colors.length] }}
                    />
                    <span className="legend-name">{category.big_category}</span>
                  </div>
                  <div className="legend-details">
                    <span className="legend-amount">
                      {Math.abs(category.spending || 0).toLocaleString('ko-KR')}원
                    </span>
                    <span className="legend-percentage">
                      {totalSpending > 0 ? ((Math.abs(category.spending || 0) / Math.abs(totalSpending)) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
                <button
                  className="visibility-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategoryVisibility(category.id);
                  }}
                >
                  {hiddenCategories.has(category.id) ? (
                    <EyeOff className="visibility-icon" />
                  ) : (
                    <Eye className="visibility-icon" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-summary">
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">총 지출</span>
            <span className="summary-value">
              {Math.abs(totalSpending).toLocaleString('ko-KR')}원
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">카테고리 수</span>
            <span className="summary-value">{categories.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">평균 지출</span>
            <span className="summary-value">
              {categories.length > 0 
                ? (Math.abs(totalSpending) / categories.length).toLocaleString('ko-KR')
                : 0}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;