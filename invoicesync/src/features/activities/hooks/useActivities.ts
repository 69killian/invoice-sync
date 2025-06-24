import { useQuery } from '@tanstack/react-query';
import { activityAPI } from '../../../lib/api';
import type { Activity } from '../types';

export const useActivities = () =>
  useQuery<Activity[]>({
    queryKey: ['activities'],
    queryFn: async () => {
      const activities = await activityAPI.list();
      return activities.filter(a => !a.type.startsWith('user_'));
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  });