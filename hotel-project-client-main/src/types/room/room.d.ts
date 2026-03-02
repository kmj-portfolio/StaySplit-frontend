export interface Room {
  hotelId: number;
  hotelName: string;
  roomType: string;
  maxOccupancy: number;
  price: number;
}

export interface RoomInfo {
  hotelId: number;
  hotelName: string;
  roomId: number;
  roomType: string;
  description: string;
  maxOccupancy: number;
  price: number;
  totalQuantity: number;
  mainImageUrl?: string;
  additionalPhotoUrls?: string[];
}

export interface CreateRoomRequest {
  description: string;
  roomType: string;
  price: number;
  occupancy: number;
  totalQuantity: number;
}

export interface UpdateRoomRequest {
  roomId: number;
  description: string;
  roomType: string;
  maxOccupancy: number;
  price: number;
  totalQuantity: number;
}
