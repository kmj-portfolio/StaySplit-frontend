import client from '../instance/client';
import handleApiReqeust from './handleApiReqeust';
import type { Review } from '@/types/review/review';

export interface PageReview {
  content: Review[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  last: boolean;
  empty: boolean;
}

export const getCustomerReviews = async (customerId: number, page = 0, size = 20) => {
  return await handleApiReqeust<PageReview>(() =>
    client.get(`/api/reviews/customers/${customerId}`, { params: { page, size } }),
  );
};

export const getHotelReviews = async (hotelId: number, page = 0, size = 20) => {
  return await handleApiReqeust<PageReview>(() =>
    client.get(`/api/reviews/hotels/${hotelId}`, { params: { page, size } }),
  );
};

export const updateReview = async (
  reviewId: number,
  data: { customerId: number; content: string; rating: number },
) => {
  return await handleApiReqeust<string>(() => client.put(`/api/reviews/${reviewId}`, data));
};

export const deleteReview = async (reviewId: number, customerId: number) => {
  return await handleApiReqeust<string>(() =>
    client.delete(`/api/reviews/${reviewId}`, { params: { customerId } }),
  );
};
