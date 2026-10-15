import type { BaseEntity } from "./base.model";
import type { CartItem } from "./cart.model";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order extends BaseEntity {
  items: CartItem[];
  totalAmount: number;
  shippingAddress: string;
  status: OrderStatus;
}
