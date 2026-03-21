import { Link } from 'react-router-dom';
import { formatNumberWithComma } from '@/utils/format/formatUtil';

interface HotelSimpleCardProps {
  hotelId: number;
  name: string;
  address: string;
  mainImageUrl?: string;
  starLevel: number;
  minPrice: number;
}

const HotelSimpleCard = ({ hotelId, name, address, mainImageUrl, starLevel, minPrice }: HotelSimpleCardProps) => {
  return (
    <Link to={`/hotels/${hotelId}`}>
      <div
        aria-label={name}
        className="hover:border-primary-200 relative flex w-full gap-4 rounded-2xl border border-gray-200 p-4 transition-colors lg:max-w-[300px] lg:flex-col"
      >
        {/* 이미지 */}
        <div className="bg-primary-700 h-[120px] w-[120px] shrink-0 overflow-hidden rounded-2xl lg:h-[200px] lg:w-full">
          {mainImageUrl && (
            <img src={mainImageUrl} alt={name} className="h-full w-full object-cover" />
          )}
        </div>

        {/* 내용 */}
        <div className="w-full">
          <p className="text-primary-700 text-xs lg:text-sm">{`${starLevel}성급`}</p>
          <h3 className="font-bold lg:text-lg">{name}</h3>
          <p className="mb-0.5 text-sm font-light text-gray-500">{address}</p>
          <div className="text-end text-gray-700 lg:text-lg">{`₩${formatNumberWithComma(minPrice)}`}</div>
        </div>
      </div>
    </Link>
  );
};

export default HotelSimpleCard;
