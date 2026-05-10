export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chế biến",
  ready: "Sẵn sàng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-amber-100 text-amber-800",
  ready: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export interface CartItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

export interface MenuItemWithCategory {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  categoryId: number;
  isAvailable: boolean;
  sortOrder: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface OrderWithItems {
  id: number;
  orderNumber: string;
  tableId: number;
  status: OrderStatus;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  table: {
    id: number;
    number: number;
    name: string | null;
  };
  items: {
    id: number;
    quantity: number;
    unitPrice: number;
    itemName: string;
    menuItemId: number;
  }[];
}
