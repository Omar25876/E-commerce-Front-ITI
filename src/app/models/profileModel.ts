export interface Address {
  city: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
}

export interface PaymentCard {
  id: string;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv:string;
}
export interface EditablePaymentCard extends PaymentCard {
  editable?: boolean;
}


export interface UserInfo {
  id:string;
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
  user: UserInfo;
}
