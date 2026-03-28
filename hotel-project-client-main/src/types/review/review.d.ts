export interface Review {
  reviewId: number;
  customerId: number;
  hotelId: number;
  hotelName: string;
  nickname: string;
  content: string;
  rating: number;
  createdAt: string;
}
