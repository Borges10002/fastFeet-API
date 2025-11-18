export enum OrderStatus {
  PENDING = "PENDING",
  AWAITING = "AWAITING",
  PICKED_UP = "PICKED_UP",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
}

export interface Order {
  id: string;
  title: string;
  description?: string;
  status: OrderStatus;
  photoUrl?: string;
  recipientId: string;
  deliverymanId?: string;
  createdAt: Date;
  updatedAt: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
}

export interface CreateOrderRequest {
  title: string;
  description?: string;
  recipientId: string;
}
