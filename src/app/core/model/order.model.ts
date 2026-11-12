import type { BaseEntity } from "./base.model";
import type { CartItem } from "./cart.model";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order extends BaseEntity {
  userId: number;
  customerName: string;
  customerPhone: string;
  paymentMethod: 'cod' | 'banking';
  note?: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: string;
  status: OrderStatus;
}
