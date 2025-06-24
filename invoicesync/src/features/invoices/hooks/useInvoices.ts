import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceAPI } from '../../../lib/api';
import type { Invoice, InvoiceUpdate, InvoiceCreate } from '../types';

export const useInvoices = () =>
  useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: invoiceAPI.list,
  });

export const useInvoice = (id: string) =>
  useQuery<Invoice>({
    queryKey: ['invoices', id],
    queryFn: () => invoiceAPI.get(id),
    enabled: !!id,
  });

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: invoiceAPI.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
};

export const useUpdateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; payload: InvoiceUpdate }) => invoiceAPI.update(vars.id, vars.payload),
    onSuccess: (_: unknown, vars: { id: string; payload: InvoiceUpdate }) => {
      const { id } = vars;
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['invoices', id] });
    },
  });
};

export const useDeleteInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: invoiceAPI.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
  });
}; 