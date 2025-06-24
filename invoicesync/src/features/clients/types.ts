export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  totalRevenue: number;
  projectsCount: number;
  createdAt: string;
}

export interface ClientCreate {
  name: string;
  email?: string;
  phone?: string;
  status?: string;
  projectsCount?: number;
  totalRevenue?: number;
}

export type ClientUpdate = Partial<ClientCreate>; 