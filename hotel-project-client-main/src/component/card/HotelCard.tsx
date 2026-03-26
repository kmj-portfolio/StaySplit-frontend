import { Link } from 'react-router-dom';
import { formatNumberWithComma } from '@/utils/format/formatUtil';
import { MapPin, Star } from 'lucide-react';

interface HotelCardProps {
  hotelId: number;
  starLevel: number;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  mainImageUrl?: string;
  minPrice: number;
  liked: boolean;
  handleChangeLike: () => void;
  checkIn?: string;
  checkOut?: string;
}

const ratingLabel = (rating: number) => {
  if (rating >= 4.5) return '매우 우수';
  if (rating >= 4.0) return '우수';
  if (rating >= 3.5) return '좋음';
  if (rating >= 3.0) return '보통';
  return '';
};

const HotelCard = ({
  hotelId,
  starLevel,
  name,
  address,
  rating,
  reviewCount,
  mainImageUrl,
  minPrice,
  checkIn,
  checkOut,
}: HotelCardProps) => {
  return (
    <Link to={`/hotels/${hotelId}`} state={{ checkIn, checkOut }}>
      <div
        aria-label={name}
        className="group flex w-full gap-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-gray-200"
      >
        {/* 이미지 */}
        <div className="relative h-[180px] w-[300px] shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-[260px] sm:w-[300px]">
          {mainImageUrl ? (
            <img
              src={mainImageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>

        {/* 내용 */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div className="flex flex-col gap-1.5">
            {/* 호텔명 */}
            <h3 className="text-2xl font-bold text-gray-900 leading-snug">{name}</h3>

            {/* 성급 별 아이콘 */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: starLevel }).map((_, i) => (
                <Star key={i} size={14} fill="#FBBF24" stroke="#FBBF24" />
              ))}
            </div>

            {/* 주소 */}
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin size={13} className="shrink-0" />
              <p className="truncate text-sm">{address}</p>
            </div>
          </div>

          {/* 평점 + 가격 */}
          <div className="flex items-end justify-between">
            {/* 평점 배지 */}
            <div className="flex items-center gap-2">
              <span className="bg-primary-600 rounded-lg rounded-tl-none px-2 py-1 text-sm font-bold text-white">
                {rating.toFixed(1)}
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-gray-700">{ratingLabel(rating)}</span>
                <span className="text-xs text-gray-400">후기 {reviewCount > 999 ? '999+' : reviewCount}개</span>
              </div>
            </div>

            {/* 가격 */}
            <div className="text-right">
              <p className="text-xs text-gray-400">1박 기준</p>
              <p className="text-xl font-bold text-gray-900">
                ₩{formatNumberWithComma(minPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
