import { Client, ClientCreate, ClientUpdate } from '../features/clients/types';
import { Service, ServiceCreate, ServiceUpdate } from '../features/services/types';
import { Invoice, InvoiceCreate, InvoiceUpdate } from '../features/invoices/types';

// URL de base de l'API : on privilégie la variable d'environnement, sinon fallback vers le port exposé par launchSettings.json
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5081/api";

export async function apiFetch<T>(endpoint: string, options: RequestInit & { body?: any } = {}): Promise<T> {
  const { body, ...rest } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(rest.headers || {})
    },
    ...rest,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    throw new Error('unauth');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  // Pas de contenu
  if (res.status === 204) return {} as T;

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    // S'il y a bien du JSON on le parse
    return res.json() as Promise<T>;
  }
  // Sinon, on retourne un objet vide / texte brut
  return {} as T;
}

export function post<T>(endpoint: string, body?: any) {
  return apiFetch<T>(endpoint, { method: 'POST', body });
}

export function get<T>(endpoint: string) {
  return apiFetch<T>(endpoint);
}

export function del<T>(endpoint: string) {
  return apiFetch<T>(endpoint, { method: 'DELETE' });
}

export function put<T>(endpoint: string, body?: any) {
  return apiFetch<T>(endpoint, { method: 'PUT', body });
}

export const clientAPI = {
  list: () => get<Client[]>('/client'),
  get: (id: string) => get<Client>(`/client/${id}`),
  create: (payload: ClientCreate) => post<Client>('/client', payload),
  update: (id: string, payload: ClientUpdate) => put(`/client/${id}`, payload),
  remove: (id: string) => del(`/client/${id}`),
};

export const serviceAPI = {
  list: () => get<Service[]>('/service'),
  get: (id: string) => get<Service>(`/service/${id}`),
  create: (payload: ServiceCreate) => post<Service>('/service', payload),
  update: (id: string, payload: ServiceUpdate) => put(`/service/${id}`, payload),
  remove: (id: string) => del(`/service/${id}`),
};

export const invoiceAPI = {
  list: () => get<Invoice[]>('/invoice'),
  get: (id: string) => get<Invoice>(`/invoice/${id}`),
  create: (payload: InvoiceCreate) => post<Invoice>('/invoice', payload),
  update: (id: string, payload: InvoiceUpdate) => put(`/invoice/${id}`, payload),
  remove: (id: string) => del(`/invoice/${id}`),
}; 