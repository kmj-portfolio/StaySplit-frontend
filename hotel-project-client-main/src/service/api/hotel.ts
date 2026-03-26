import client from '@/service/instance/client';
import handleApiReqeust from './handleApiReqeust';

import type { HotelDetail, HotelItem } from '@/types/hotel';
import type { RoomInfo } from '@/types/room/room';
import type { PaginationResult } from '@/types/pageable';

export interface HotelSearchBody {
  checkIn: string;
  checkOut: string;
  latitude: number;
  longitude: number;
  numGuest: number;
  minPrice: number;
  maxPrice: number;
  numStar: number[];
}

export const getSearchHotels = async (body: HotelSearchBody, page = 0, size = 10) => {
  const response = await handleApiReqeust<PaginationResult<HotelItem>>(() =>
    client.post('/api/hotels/search', body, { params: { page, size } }),
  );
  return response;
};

export const getHotelDetail = async (hotelId: number) => {
  const response = await handleApiReqeust<HotelDetail>(() =>
    client.get(`/api/hotels/${hotelId}`),
  );
  return response;
};

export const getAllHotels = async (query: string) => {
  const response = await handleApiReqeust<PaginationResult<HotelItem>>(() =>
    client.get(`/api/hotels/list?${query}`),
  );
  return response;
};

export const getHotelRooms = async (hotelId: number, page = 0, size = 20) => {
  return await handleApiReqeust<PaginationResult<RoomInfo>>(() =>
    client.get(`/api/hotels/${hotelId}/rooms`, { params: { page, size } }),
  );
};
