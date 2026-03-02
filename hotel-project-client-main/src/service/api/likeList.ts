import client from '../instance/client';
import handleApiReqeust from './handleApiReqeust';

export interface LikeListEntity {
  id: number;
  customer: { id: number };
  listName: string;
}

export interface LikeHotelItem {
  id: number;
  customerId: number;
  hotelId: number;
}

export interface PageLikeHotel {
  content: LikeHotelItem[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  last: boolean;
  empty: boolean;
}

export const getCustomerLikeLists = async (customerId: number) => {
  return await handleApiReqeust<LikeListEntity[]>(() =>
    client.get(`/api/likelist/customer/${customerId}`),
  );
};

export const createLikeList = async (customerId: number, listName: string) => {
  return await handleApiReqeust<LikeListEntity>(() =>
    client.post('/api/likelist', { customerId, listName }),
  );
};

export const deleteLikeList = async (likeListId: number) => {
  return await handleApiReqeust<unknown>(() => client.delete(`/api/likelist/${likeListId}`));
};

export const getHotelsInLikeList = async (likeListId: number, page = 0, size = 20) => {
  return await handleApiReqeust<PageLikeHotel>(() =>
    client.get(`/api/likelist/${likeListId}/hotels`, { params: { page, size } }),
  );
};

export const removeHotelFromLikeList = async (likeListId: number, hotelId: number) => {
  return await handleApiReqeust<unknown>(() =>
    client.delete(`/api/likelist/${likeListId}/hotels/${hotelId}`),
  );
};
