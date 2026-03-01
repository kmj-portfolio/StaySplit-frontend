import { memo } from 'react';
import { Calendar, Hotel, MapPin, Users } from 'lucide-react';
import Card from '@/component/common/card/Card';
import type {
  ReservationCardProps,
  BookingStatusProps,
  HotelImageProps,
  ReservationStatus,
} from '@/types/ReservationType';
import { formatNumberToWon } from '@/utils/format/formatUtil';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { getPaymentsByReservationId } from '@/service/api/payment';

// 예약 상태 표시 컴포넌트
const BookingStatus = memo(({ status }: BookingStatusProps) => {
  const statusConfig: Record<ReservationStatus, { text: string; color: string }> = {
    WAITING_PAYMENT: { text: '결제 대기', color: 'text-amber-500' },
    CONFIRMED: { text: '예약 완료', color: 'text-blue-600' },
    CANCELLED: { text: '예약 취소', color: 'text-red-600' },
    EXPIRED: { text: '기간 만료', color: 'text-gray-500' },
    COMPLETE: { text: '이용 완료', color: 'text-gray-600' },
  };

  const config = statusConfig[status];

  return <span className={`font-bold ${config.color}`}>{config.text}</span>;
});

BookingStatus.displayName = 'BookingStatus';

// 호텔 이미지 컴포넌트
const HotelImage = memo(({ image, hotelName }: HotelImageProps) => (
  <div className="min-h-[100px] w-24 flex-shrink-0 self-stretch rounded-lg bg-gradient-to-r from-purple-400 to-pink-400">
    <img
      src={image}
      alt={`${hotelName} 이미지`}
      className="h-full w-full rounded-lg object-cover"
      loading="lazy"
    />
  </div>
));

HotelImage.displayName = 'HotelImage';

// 메인 예약 카드 컴포넌트
const ReservationCard = memo(({ booking }: ReservationCardProps) => {
  const { setPayments, togglePayment, setReservationId } = usePaymentStore();

  const handleCardClick = async () => {
    setReservationId(booking.reservationId);
    const res = await getPaymentsByReservationId(booking.reservationId);
    setPayments(res);
    if (res) {
      togglePayment();
    }
  };

  return (
    <div
      className="cursor-pointer rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
      onClick={handleCardClick}
    >
    <Card className="p-6">
      {/* 예약 헤더 */}
      <Card.Header className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Hotel className="h-5 w-5 text-gray-400" />
          <span className="text-gray-600">예약번호: {booking.reservationNumber}</span>
        </div>
        <BookingStatus status={booking.reservationStatus} />
      </Card.Header>

      {/* 카드 컨텐츠 */}
      <Card.Content>
        <div className="flex items-center space-x-4">
          <HotelImage image={booking.hotelMainImageUrl} hotelName={booking.hotelName} />

          <div className="flex-1">
            <div className="mb-1 flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <h3 className="font-semibold text-gray-800">{booking.hotelName}</h3>
            </div>
            <div className="mb-2 text-sm text-gray-500">{booking.hotelAddress}</div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>체크인: {booking.checkInDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>체크아웃: {booking.checkOutDate}</span>
              </div>
            </div>

            <div className="mt-1 flex items-center space-x-1 text-sm text-gray-600">
              <Users className="h-4 w-4 text-gray-400" />
              <span>투숙객 {booking.numberOfParticipants}명</span>
            </div>

            <div className="mt-2 font-bold text-gray-800">
              {formatNumberToWon(booking.totalPrice)}
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
    </div>
  );
});

ReservationCard.displayName = 'ReservationCard';

export default ReservationCard;
