import type { ReservationResponse, ReservationStatus } from '@/types/ReservationType';
import client from '../instance/client';
import handleApiReqeust from './handleApiReqeust';

export interface ReservationParams {
  status?: ReservationStatus;
  afterDate?: string;
  page?: number;
  size?: number;
}

export interface CreateReservationRequest {
  hotelId: number;
  roomsAndQuantities: { roomId: number; quantity: number }[];
  checkInDate: string;
  checkOutDate: string;
  invitedEmails: string[];
  isSplitPayment: boolean;
}

export const createReservation = async (data: CreateReservationRequest) => {
  return await handleApiReqeust<{ reservationId: number; reservationNumber: string }>(() =>
    client.post('/api/reservations', data),
  );
};

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
