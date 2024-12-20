import { useState, useCallback } from 'react';
import { mlmApi } from '../api/mlmApi';

export function useMLM() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [networkData, setNetworkData] = useState([]);
  const [metrics, setMetrics] = useState({
    networkSize: 0,
    totalRevenue: 0,
    totalCommissions: 0,
    tierDistribution: {}
  });

  const generateNetwork = useCallback(async (size) => {
    try {
      setIsLoading(true);
      setError(null);
      const { users, metrics: newMetrics } = await mlmApi.generateNetwork(size);
      setNetworkData(users);
      setMetrics(newMetrics);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateNetwork = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await mlmApi.validateNetwork();
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    networkData,
    metrics,
    generateNetwork,
    validateNetwork
  };
}