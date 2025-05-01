export interface Address {
  city: string;
  street: string;
  buildingNumber: string;
  apartmentNumber: string;
}

export interface User {
  profileImageUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
  phone: string;
  gender: 'male' | 'female';
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}
