import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../../../lib/api';
import type { UserUpdate } from '../types';

export const useUser = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return userAPI.get(userId);
    },
    enabled: !!userId, // Ne fait pas l'appel si userId est undefined
  });

  const updateMut = useMutation({
    mutationFn: (data: UserUpdate) => {
      if (!userId) throw new Error('User ID is required');
      return userAPI.update(userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error('User ID is required');
      return userAPI.remove(userId);
    },
  });

  return {
    user,
    isLoading: isLoading && !!userId, // On considère le chargement uniquement si on a un userId
    updateUser: updateMut.mutate,
    isUpdating: updateMut.isPending,
    deleteUser: deleteMut.mutate,
    isDeleting: deleteMut.isPending,
  };
}; 