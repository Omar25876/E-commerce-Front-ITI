export interface OrderResponse {
  orders: Order[];
}

export interface SingleOrderResponse {
  order: Order;
}

export interface Order {
  _id: string;
  userId: User | null;
  orderId: number;
  Status: string;
  DeliveyType: string;
  items: OrderItem[];
  totalAmount: number;
  AfterSale: number;
  PromoCode: string;
  payment: any;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderItem {
  Id: string;
  Brand: string;
  Image: string;
  name: string;
  quantity: number;
  price: number;
  SelectedColor: string;
  _id: string;
}

export interface ShippingAddress {
  city: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  floor: string;
  entrance: string;
  zipCode: string;
  country: string;
}

export interface User {
  _id: string;
  profileImageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  address: ShippingAddress;
  gender: string;
  isAdmin: boolean;
  paymentCards: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
