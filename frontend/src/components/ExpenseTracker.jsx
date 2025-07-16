import React, { useState, useEffect } from "react";
import { AlertCircle, RefreshCw, TrendingUp, Calendar, Wallet, CreditCard, PieChart, BarChart3, Sparkles, Star } from "lucide-react";
import Navigation from "./Navigation";
import Carousel from "./Carousel";
import FileUpload from "./FileUpload";
import DashboardOverview from "./DashboardOverview";
import CategoryManager from "./CategoryManager";
import TransactionFilters from "./TransactionFilters";
import TransactionTable from "./TransactionTable";
import SpendingChart from "./SpendingChart";
import { useExpenseData } from "../hooks/useExpenseData";
import "./ExpenseTracker.css";

const ExpenseTracker = () => {
  const {
    transactions,
    categories,
    loading,
    error,
    uploadFile,
    addCategory,
    exportData,
    fetchTransactions,
  } = useExpenseData();

  const [filterCategory, setFilterCategory] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showError, setShowError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Handle error display
  useEffect(() => {
    if (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  }, [error]);

  const handleFileUpload = async (file) => {
    try {
      await uploadFile(file, "920615");
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleCategoryAdd = async (categoryData) => {
    try {
      await addCategory(categoryData);
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  const handleExport = () => {
    exportData();
  };

  const handleRefresh = () => {
    fetchTransactions();
  };

  const totalSpending = transactions.reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions.filter((t) => {
    const categoryMatch =
      filterCategory === "all" || t.category === filterCategory;
    const dateMatch =
      (!dateRange.start || new Date(t.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(t.date) <= new Date(dateRange.end));
    return categoryMatch && dateMatch;
  });

  // Calculate additional metrics
  const avgTransactionAmount = transactions.length > 0 ? totalSpending / transactions.length : 0;
  const thisMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const now = new Date();
    return transactionDate.getMonth() === now.getMonth() && 
           transactionDate.getFullYear() === now.getFullYear();
  });

  // Create carousel items for overview
  const carouselItems = [
    <div className="carousel-slide-content">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 gradient-bg-primary rounded-3xl flex items-center justify-center shadow-lg">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">총 지출 현황</h3>
          <p className="text-4xl font-bold text-purple-600">{totalSpending.toLocaleString('ko-KR')} 원</p>
          <p className="text-gray-600">이번 달 총 지출 금액</p>
        </div>
      </div>
    </div>,
    <div className="carousel-slide-content">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-lg">
          <CreditCard className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">거래 통계</h3>
          <p className="text-4xl font-bold text-blue-600">{transactions.length}</p>
          <p className="text-gray-600">총 거래 건수</p>
        </div>
      </div>
    </div>,
    <div className="carousel-slide-content">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-lg">
          <PieChart className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">평균 지출</h3>
          <p className="text-4xl font-bold text-green-600">{avgTransactionAmount.toLocaleString('ko-KR')} 원</p>
          <p className="text-gray-600">거래당 평균 금액</p>
        </div>
      </div>
    </div>
  ];

  return (
    <div className="min-h-screen expense-tracker" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Error/Success Alerts */}
        {showError && error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800">오류가 발생했습니다</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {uploadSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
            <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <h3 className="font-semibold text-green-800">업로드 완료!</h3>
              <p className="text-green-700 text-sm">파일이 성공적으로 처리되었습니다</p>
            </div>
          </div>
        )}

        {/* Enhanced Balance Card with Gradient */}
        <div className="toss-card rounded-3xl p-8 mb-8 hover-lift fade-in" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-white text-opacity-90 font-medium">이번 달 총 지출</span>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 text-yellow-300" />
                  <span className="text-white text-opacity-75 text-sm">스마트 분석</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white text-opacity-75">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{new Date().toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="text-4xl font-bold text-white mb-2">
              {totalSpending.toLocaleString('ko-KR')} 원
            </div>
            <div className="text-white text-opacity-80">
              평균 거래금액 {avgTransactionAmount.toLocaleString('ko-KR')} 원
            </div>
          </div>
          
          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{thisMonthTransactions.length}</div>
              <div className="text-white text-opacity-80 text-sm">거래 건수</div>
            </div>
            <div className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">{categories.filter(c => c.spending > 0).length}</div>
              <div className="text-white text-opacity-80 text-sm">활성 카테고리</div>
            </div>
            <div className="text-center p-4 bg-white bg-opacity-10 rounded-2xl backdrop-blur-sm">
              <div className="text-2xl font-bold text-white mb-1">
                {Math.round(thisMonthTransactions.reduce((sum, t) => sum + t.amount, 0) / 10000)}만
              </div>
              <div className="text-white text-opacity-80 text-sm">이번 달 지출</div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="toss-card rounded-3xl p-3 mb-8 shadow-lg">
          <div className="flex gap-2">
            {[
              { id: 'dashboard', label: '개요', icon: TrendingUp, gradient: 'from-purple-500 to-pink-500' },
              { id: 'transactions', label: '거래내역', icon: CreditCard, gradient: 'from-blue-500 to-cyan-500' },
              { id: 'categories', label: '카테고리', icon: PieChart, gradient: 'from-green-500 to-teal-500' },
              { id: 'analytics', label: '분석', icon: BarChart3, gradient: 'from-orange-500 to-red-500' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all font-semibold ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <Carousel items={carouselItems} autoPlay={true} interval={4000} />
            <FileUpload onFileUpload={handleFileUpload} loading={loading} />
            <DashboardOverview
              totalSpending={totalSpending}
              transactionCount={transactions.length}
              categoryCount={categories.length}
            />
            <SpendingChart categories={categories} totalSpending={totalSpending} />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <TransactionFilters
              categories={categories}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
            <TransactionTable
              transactions={filteredTransactions}
              onExport={handleExport}
            />
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <CategoryManager
              categories={categories}
              onAddCategory={handleCategoryAdd}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <SpendingChart categories={categories} totalSpending={totalSpending} />
            {/* Add more analytics components here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;