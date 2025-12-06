import { useEffect, useState } from 'react';

// Hook to auto-refresh DAG status (useful for monitoring running DAGs)
export const useAutoRefresh = (callback, interval = 5000, enabled = false) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const refresh = async () => {
      setIsRefreshing(true);
      await callback();
      setIsRefreshing(false);
    };

    const intervalId = setInterval(refresh, interval);
    return () => clearInterval(intervalId);
  }, [callback, interval, enabled]);

  return isRefreshing;
};
