import client from '@/service/instance/client';
import handleApiReqeust from './handleApiReqeust';

import type { HotelDetail, CreateHotelRequest, UpdateHotelRequest, CreateHotelResponse, PhotoDetailResponse } from '@/types/hotel';
import type { RoomInfo, CreateRoomRequest, UpdateRoomRequest } from '@/types/room/room';
import type { PaginationResult } from '@/types/pageable';

export const createHotel = async (data: CreateHotelRequest) => {
  const response = await handleApiReqeust<CreateHotelResponse>(() =>
    client.post('/api/hotels/', data),
  );
  return response;
};

export const getProviderHotelDetail = async (hotelId: number) => {
  const response = await handleApiReqeust<HotelDetail>(() =>
    client.get(`/api/hotels/${hotelId}`),
  );
  return response;
};

export const updateHotel = async (hotelId: number, data: UpdateHotelRequest) => {
  const response = await handleApiReqeust<HotelDetail>(() =>
    client.put(`/api/hotels/${hotelId}`, data),
  );
  return response;
};

export const deleteHotel = async (hotelId: number) => {
  const response = await handleApiReqeust<{ hotelId: number }>(() =>
    client.delete(`/api/hotels/${hotelId}`),
  );
  return response;
};

export const getRoomsByHotel = async (hotelId: number, page = 0, size = 20) => {
  const response = await handleApiReqeust<PaginationResult<RoomInfo>>(() =>
    client.get(`/api/hotels/${hotelId}/rooms?page=${page}&size=${size}`),
  );
  return response;
};

export const createRoom = async (data: CreateRoomRequest) => {
  const response = await handleApiReqeust<RoomInfo>(() =>
    client.post('/api/rooms', data),
  );
  return response;
};

export const updateRoom = async (roomId: number, data: UpdateRoomRequest) => {
  const response = await handleApiReqeust<RoomInfo>(() =>
    client.put(`/api/rooms/${roomId}`, data),
  );
  return response;
};

export const deleteRoom = async (roomId: number) => {
  const response = await handleApiReqeust<{ hotelId: number; roomId: number }>(() =>
    client.delete(`/api/rooms/${roomId}`),
  );
  return response;
};

export const uploadHotelPhoto = async (hotelId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await handleApiReqeust<PhotoDetailResponse>(() =>
    client.post('/api/photos', formData, {
      params: { entityType: 'HOTEL', entityId: hotelId, displayType: 'MAIN' },
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  );
  return response;
};

export const uploadRoomPhoto = async (
  roomId: number,
  file: File,
  displayType: 'MAIN' | 'ADDITIONAL',
) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await handleApiReqeust<PhotoDetailResponse>(() =>
    client.post('/api/photos', formData, {
      params: { entityType: 'ROOM', entityId: roomId, displayType },
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  );
  return response;
};

export const uploadRoomPhotos = async (
  roomId: number,
  files: File[],
  displayTypes: ('MAIN' | 'ADDITIONAL')[],
) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const params = new URLSearchParams();
  params.append('entityType', 'ROOM');
  params.append('entityId', String(roomId));
  displayTypes.forEach((dt) => params.append('displayType', dt));
  const response = await handleApiReqeust<PhotoDetailResponse[]>(() =>
    client.post(`/api/photos/list?${params.toString()}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  );
  return response;
};

export const deletePhoto = async (filename: string) => {
  await handleApiReqeust<string>(() => client.delete(`/api/photos/${filename}`));
};
