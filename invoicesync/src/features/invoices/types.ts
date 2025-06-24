export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  totalExclTax: number;
  totalInclTax: number;
  status: string;
  dateIssued: string; // ISO
  dueDate?: string | null;
  // List of service lines included in this invoice (present only when invoice is fetched with details)
  services?: InvoiceService[];
}

// Service information returned when retrieving an invoice (read-only)
export interface InvoiceService {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceServiceItem {
  serviceId: string;
  quantity: number;
}

export interface InvoiceCreate {
  invoiceNumber: string;
  clientId: string;
  dateIssued: string;
  dueDate?: string;
  services: InvoiceServiceItem[];
}

export type InvoiceUpdate = Partial<InvoiceCreate> & {
  status?: string;
  services?: InvoiceServiceItem[];
}; 