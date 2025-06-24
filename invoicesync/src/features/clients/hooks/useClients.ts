import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientAPI } from '../../../lib/api';
import { Client, ClientCreate, ClientUpdate } from '../types';

export const useClients = () =>
  useQuery({
    queryKey: ['clients'],
    queryFn: clientAPI.list,
  });

export const useClient = (id: string) =>
  useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientAPI.get(id),
    enabled: !!id,
  });

export const useCreateClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clientAPI.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
};

export const useUpdateClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; payload: ClientUpdate }) => clientAPI.update(vars.id, vars.payload),
    onSuccess: (_: unknown, vars: { id: string; payload: ClientUpdate }) => {
      const { id } = vars;
      qc.invalidateQueries({ queryKey: ['clients'] });
      qc.invalidateQueries({ queryKey: ['clients', id] });
    },
  });
};

export const useDeleteClient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clientAPI.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  });
}; 