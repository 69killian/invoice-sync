import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceAPI } from '../../../lib/api';
import type { Service, ServiceUpdate } from '../types';

export const useServices = () =>
  useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: serviceAPI.list,
  });

export const useService = (id: string) =>
  useQuery<Service>({
    queryKey: ['services', id],
    queryFn: () => serviceAPI.get(id),
    enabled: !!id,
  });

export const useCreateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: serviceAPI.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
};

export const useUpdateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; payload: ServiceUpdate }) => serviceAPI.update(vars.id, vars.payload),
    onSuccess: (_: unknown, vars: { id: string; payload: ServiceUpdate }) => {
      const { id } = vars;
      qc.invalidateQueries({ queryKey: ['services'] });
      qc.invalidateQueries({ queryKey: ['services', id] });
    },
  });
};

export const useDeleteService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: serviceAPI.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });
}; 