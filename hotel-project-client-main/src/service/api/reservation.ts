import type { ReservationResponse, ReservationStatus } from '@/types/ReservationType';
import client from '../instance/client';
import handleApiReqeust from './handleApiReqeust';

export interface ReservationParams {
  status?: ReservationStatus;
  afterDate?: string;
  page?: number;
  size?: number;
}

export const getReservationInfo = async (params?: ReservationParams) => {
  const response = await handleApiReqeust<ReservationResponse>(() =>
    client.get('/api/reservations', {
      params: {
        status: params?.status,
        afterDate: params?.afterDate,
        page: params?.page ?? 0,
        size: params?.size ?? 20,
      },
    }),
  );
  return response;
};
