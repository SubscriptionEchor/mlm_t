import { useState, useCallback } from 'react';
import { mlmApi } from '../api/mlmApi';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await mlmApi.getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTransactionDetails = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const transaction = await mlmApi.getTransactionDetails(id);
      setSelectedTransaction(transaction);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    transactions,
    selectedTransaction,
    isLoading,
    error,
    loadTransactions,
    getTransactionDetails,
    setSelectedTransaction
  };
}