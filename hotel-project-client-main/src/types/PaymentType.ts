export type PaymentStatus = 'PAID' | 'FAILED' | 'CANCELLED';

export interface PaymentResponse {
  portOnePaymentId: string;
  paymentAmount: number;
  payMethod: string;
  cardPublisher?: string;
  reservationId: number;
  reservationNumber: string;
  status: PaymentStatus;
  paidAt: string;
}

export interface PaymentListResponse {
  content: PaymentResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface CreatePaymentRequest {
  portOnePaymentId: string;
  reservationId: number;
}

export interface CancelPaymentRequest {
  portOnePaymentId: string;
  reason: string;
}
