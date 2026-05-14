/**
 * ## src/types/index.ts
 */

export type Role = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface User {
  id: string;
  username: string;
  full_name: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Item {
  id: string;
  code: string;
  name: string;
  category?: string;
  base_unit: string;
  min_stock: number;
  is_active: boolean;
  total_stock?: number;
}

export interface ItemUnit {
  id: number;
  item_id: string;
  unit_name: string;
  conversion_ratio: number;
  operator: '*' | '/';
}

export interface Warehouse {
  id: string;
  name: string;
  location?: string;
  pic?: string;
  phone?: string;
  is_active: boolean;
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

export type TransactionType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';

export interface Transaction {
  id: string;
  date: string;
  reference_no: string;
  delivery_order_no?: string;
  type: TransactionType;
  source_warehouse_id: string;
  source_warehouse_name?: string;
  target_warehouse_id?: string;
  target_warehouse_name?: string;
  partner_id?: string;
  partner_name?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  items?: TransactionItem[];
}

export interface TransactionItem {
  id: number;
  transaction_id: string;
  item_id: string;
  item_name?: string;
  item_code?: string;
  qty: number;
  unit: string;
  conversion_ratio: number;
  note?: string;
}

export interface RejectBatch {
  id: string;
  date: string;
  outlet: string;
  created_at: string;
  items?: RejectItem[];
}

export interface RejectItem {
  id: number;
  batch_id: string;
  item_id: string;
  item_name?: string;
  qty: number;
  unit: string;
  base_qty: number;
  reason?: string;
}
