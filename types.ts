
export type Language = 'uz' | 'ru' | 'en';
export type Theme = 'light' | 'dark';
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  telegramId: string;
  phone: string;
  name: string;
  role: UserRole;
  totalKg: number;
  totalSpent: number;
  createdAt: number;
}

export type TrackStatus = 
  | 'courier'         // 0-3 days
  | 'weight_pending'   // 3-6 days (Admin adds kg here)
  | 'china_warehouse'  // 6-13 days
  | 'sorting'          // 13-18 days
  | 'shipped'          // 18+ days
  | 'delivered';       // Final

export type PaymentStatus = 'not_assigned' | 'pending' | 'awaiting_verification' | 'paid';

export interface Track {
  id: string;
  userId: string;
  trackNumber: string;
  weight: number; // in kg
  price: number;  // in UZS
  status: TrackStatus;
  paymentStatus: PaymentStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Translation {
  welcome: string;
  login: string;
  enterId: string;
  enterPhone: string;
  start: string;
  home: string;
  trackers: string;
  profile: string;
  settings: string;
  addTrack: string;
  trackPlaceholder: string;
  invalidTrack: string;
  stats: string;
  totalWeight: string;
  totalPaid: string;
  tier: string;
  language: string;
  theme: string;
  adminPanel: string;
  updateWeight: string;
  save: string;
  pricePerKg: string;
  loyaltyFriend: string;
  loyaltyDear: string;
  loyaltyPartner: string;
  pay: string;
  paymentDetails: string;
  confirmPayment: string;
  awaitingVerification: string;
}
