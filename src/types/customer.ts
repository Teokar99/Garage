import type { Vehicle } from './vehicle';

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  vehicles?: Vehicle[];
}
