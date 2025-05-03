export interface Specs {
  [key: string]: string;
}

export interface Review {
  user: string;
  rating: number;
  comment: string;
  _id: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number;
  discount: number;
  colors: string[]; // derived from imagesAndColors keys
  images: string[]; // derived from imagesAndColors values
  imagesAndColors: Record<string, string>;
  selectedColor: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  highlights: string[];
  specs: Record<string, string>;
  modelNumber: string;
  modelName: string;
  whatsInTheBox: string[];
  isPopular: boolean;
  isNewArrival: boolean;
  isDiscover: boolean;
  category: string;
  brand: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  total: number;
  page: number;
  limit: number;
  products: Product[];
}
