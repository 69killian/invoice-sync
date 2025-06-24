export interface Service {
  id: string;
  name: string;
  description?: string | null;
  unitPrice: number;
  recurrence?: string | null;
  createdAt: string;
}

export interface ServiceCreate {
  name: string;
  description?: string;
  unitPrice: number;
  recurrence?: string;
  userId?: string; // sera renseigné côté front avant l'appel API
}

export type ServiceUpdate = Partial<ServiceCreate>; 