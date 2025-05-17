export interface PromoCode {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate: string; // ISO string
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
