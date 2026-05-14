/**
 * ## src/types.ts
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface User {
  id: string;
  username: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location?: string;
  pic?: string;
  phone?: string;
  is_active: boolean;
}

export interface Item {
  id: string;
  code: string;
  name: string;
  category?: string;
  base_unit: string;
  min_stock: number;
  is_active: boolean;
  stock?: number;
}

export interface Partner {
  id: string;
  type: 'SUPPLIER' | 'CUSTOMER';
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  npwp?: string;
  is_active: boolean;
}

export enum TransactionType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER = 'TRANSFER',
  ADJUSTMENT = 'ADJUSTMENT'
}

export interface Transaction {
  id: string;
  date: string;
  reference_no: string;
  delivery_order_no?: string;
  type: TransactionType;
  source_warehouse_id: string;
  target_warehouse_id?: string;
  partner_id?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}
