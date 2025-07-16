import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const useExpenseData = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/transactions`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    }
  }, []);

  // Upload file
  const uploadFile = useCallback(async (file, userId = '1') => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const result = await response.json();
      
      // Refresh transactions after successful upload
      await fetchTransactions();
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error uploading file:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  // Add category
  const addCategory = useCallback(async (categoryData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const result = await response.json();
      
      // Refresh categories after successful addition
      await fetchCategories();
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error adding category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  // Add transaction
  const addTransaction = useCallback(async (transactionData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      const result = await response.json();
      
      // Refresh transactions after successful addition
      await fetchTransactions();
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error adding transaction:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  // Export data
  const exportData = useCallback(() => {
    try {
      const dataStr = JSON.stringify(transactions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `expense-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      setError('Failed to export data');
      console.error('Error exporting data:', err);
    }
  }, [transactions]);

  // Fetch dashboard summary
  const fetchDashboardSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/summary`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard summary');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard summary:', err);
      return null;
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  return {
    transactions,
    categories,
    loading,
    error,
    fetchTransactions,
    fetchCategories,
    uploadFile,
    addCategory,
    addTransaction,
    exportData,
    fetchDashboardSummary,
  };
};