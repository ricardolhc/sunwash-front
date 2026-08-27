export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  address: Address;
  dateTime: string;
  panelsCount: number;
  roofPhotoUrl?: string;
  droneBeforePhotoUrl?: string;
  droneAfterPhotoUrl?: string;
  status: AppointmentStatus;
  price: number;
  paymentMethod?: 'PIX' | 'CREDIT_CARD';
  paymentStatus?: 'PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED';
  createdAt: string;
  completedAt?: string;
  notes?: string;
}
