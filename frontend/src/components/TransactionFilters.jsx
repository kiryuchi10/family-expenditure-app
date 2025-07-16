import React from 'react';
import { Filter, Calendar } from 'lucide-react';

const TransactionFilters = ({ 
  categories, 
  filterCategory, 
  setFilterCategory, 
  dateRange, 
  setDateRange 
}) => {
  return (
    <div className="toss-card rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Filter className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">필터</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input-toss w-full px-3 py-2 rounded-lg"
          >
            <option value="all">모든 카테고리</option>
            {categories.map((category) => (
              <option key={category.id} value={category.big_category}>
                {category.big_category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            시작 날짜
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="input-toss w-full px-3 py-2 rounded-lg pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            종료 날짜
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="input-toss w-full px-3 py-2 rounded-lg pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => {
            setFilterCategory('all');
            setDateRange({ start: '', end: '' });
          }}
          className="btn-toss-secondary px-4 py-2 rounded-lg"
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters;