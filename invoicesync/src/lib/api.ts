import { Client, ClientCreate, ClientUpdate } from '../features/clients/types';
import { Service, ServiceCreate, ServiceUpdate } from '../features/services/types';
import { Invoice, InvoiceCreate, InvoiceUpdate } from '../features/invoices/types';
import { User, UserUpdate } from '../features/settings/types';
import { Activity } from '../features/activities/types';

// URL de base de l'API : on privilégie la variable d'environnement, sinon fallback vers l'API en production
const API_URL = process.env.REACT_APP_API_URL || "https://invoice-sync-ej06.onrender.com/api";

const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include',  // Important pour les cookies d'authentification
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': 'https://invoice-sync-lilac.vercel.app'
    },
    mode: 'cors',
    cache: 'no-cache'  // Disable caching to ensure fresh responses
  };

  // Si c'est une requête POST/PUT, on s'assure que le body est bien stringifié
  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  console.log('API Request:', {
    url,
    method: finalOptions.method,
    headers: finalOptions.headers,
    body: finalOptions.body,
    cookies: document.cookie
  });

  try {
    const response = await fetch(url, finalOptions);
    
    // Log response headers for debugging
    console.log('API Response Headers:', {
      url,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      cookies: document.cookie
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Pour les requêtes qui ne retournent pas de contenu
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.log('API Error:', {
      url,
      error,
      cookies: document.cookie
    });
    throw error;
  }
};

export const get = async <T>(endpoint: string): Promise<T> => {
  return apiFetch<T>(endpoint, {
    method: 'GET',
  });
};

export const post = async <T>(endpoint: string, data?: any): Promise<T> => {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const del = async <T>(endpoint: string): Promise<T> => {
  return apiFetch<T>(endpoint, {
    method: 'DELETE',
  });
};

export const put = async <T>(endpoint: string, data: any): Promise<T> => {
  return apiFetch<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

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
  generatePdf: async (id: string) => {
    const response = await fetch(`${API_URL}/invoice/${id}/pdf`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `facture-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export const userAPI = {
  get: (id: string) => get<User>(`/user/${id}`),
  update: (id: string, payload: UserUpdate) => put(`/user/${id}`, payload),
  remove: (id: string) => del(`/user/${id}`),
};

export const activityAPI = {
  list: () => get<Activity[]>('/activity'),
  get: (id: string) => get<Activity>(`/activity/${id}`),
};

export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    post('/auth/login', credentials),
  logout: () => post('/auth/logout'),
  me: () => get<User>('/auth/me'),
  register: (data: { email: string; password: string; name: string }) => 
    post('/auth/register', data),
}; 