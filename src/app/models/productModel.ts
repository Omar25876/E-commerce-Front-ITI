export interface Specs {
  [key: string]: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  discount: number;
  colors: string[];
  selectedColor: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  highlights: string[];
  specs: Specs;
  modelNumber: string;
  modelName: string;
  whatsInTheBox: string[];
  isPopular: boolean;
  isNewArrival: boolean;
  isDiscover: boolean;
  category: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  total: number;
  page: number;
  limit: number;
  products: Product[];
}
