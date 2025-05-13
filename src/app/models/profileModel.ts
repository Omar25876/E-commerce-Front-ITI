export interface Address {
  city: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
  floor?: string;
  entrance?: string;
  zipCode?: string;
  country?: string;
}

export interface PaymentCard {
  _id: string;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
}

export interface User {
  profileImageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "male" | "female" | string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  address: Address;
  paymentCards: PaymentCard[];
}

export interface UserResponse {
  user: User;
}
