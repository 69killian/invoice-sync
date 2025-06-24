export interface User {
  id: string;
  email: string;
  company?: string;
  jobTitle?: string;
  bio?: string;
  createdAt: string;
}

export interface UserUpdate {
  company?: string;
  jobTitle?: string;
  bio?: string;
} 