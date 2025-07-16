import React from 'react';
import { Download, CreditCard } from 'lucide-react';

const TransactionTable = ({ transactions, onExport }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <div className="toss-card rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">거래 내역</h2>
        </div>
        <button
          onClick={onExport}
          className="btn-toss-primary px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          내보내기
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">날짜</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">설명</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">카테고리</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700">금액</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">유형</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-600">
                  {formatDate(transaction.date)}
                </td>
                <td className="py-3 px-4 text-gray-800 font-medium">
                  {transaction.description}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    {transaction.category || '미분류'}
                  </span>
                </td>
                <td className={`py-3 px-4 text-right font-semibold ${
                  transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type === 'income' ? '수입' : '지출'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">표시할 거래 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;