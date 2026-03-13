import client from '../instance/client';
import handleApiReqeust from './handleApiReqeust';
import type {
  CreatePaymentRequest,
  CancelPaymentRequest,
  PaymentListResponse,
  PaymentResponse,
} from '@/types/PaymentType';

export const getMyPayments = async (page = 0, size = 20) => {
  return await handleApiReqeust<PaymentListResponse>(() =>
    client.get('/api/payments/my', { params: { page, size } }),
  );
};

export const verifyPayment = async (data: CreatePaymentRequest) => {
  return await handleApiReqeust<PaymentResponse>(() =>
    client.post('/api/payments/verify', data),
  );
};

export const cancelPayment = async (data: CancelPaymentRequest) => {
  return await handleApiReqeust<string>(() => client.post('/api/payments/cancel', data));
};
