export interface Address {
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
  address: Address;
  phone: string;
  gender: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}
