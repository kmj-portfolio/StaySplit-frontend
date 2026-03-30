import RadioInput from '@/component/common/input/RadioInput';
import { useState } from 'react';

import HotelSimpleCard from '@/component/card/HotelSimpleCard';
import SearchForm from '@/component/form/SearchForm';

import useGetPopularHotels from '@/hooks/queries/hotels/useGetPopularHotels';
import CardSkeleton from '@/component/common/card/ui/CardSkeleton';

const CategoryGroup = [
  { id: 'seoul', label: '서울' },
  { id: 'busan', label: '부산' },
  { id: 'jeju', label: '제주' },
];

const HomePage = () => {
  const [radio, setRadio] = useState('seoul');

  const { data, isLoading } = useGetPopularHotels(radio);
  const hotels = data?.content ?? [];

  return (
    <section className="w-full px-4">
      {/* Banner */}

      <div className="relative">
        <div className="relative mb-20 hidden h-[250px] w-full flex-col items-center justify-center rounded-2xl bg-[url('/main-banner.png')] bg-cover bg-center bg-no-repeat text-white md:flex md:h-[300px]">
          <p className="font-bold md:text-2xl">당신의 여행을 더 스마트하게,</p>
          <p className="text-sm md:text-lg">가장 합리적인 호텔 예약, SplitStay</p>
        </div>
        <div className="mx-auto w-full md:absolute md:top-[82%] md:left-1/2 md:max-w-[1200px] md:-translate-x-1/2 md:px-8">
          <SearchForm />
        </div>
      </div>

      <div className="w-full">
        <h3 className="mb-2 font-bold md:text-lg">지금 가장 인기가 많은 숙소</h3>
        <ul
          aria-label="지역 카테고리"
          className="mb-4 flex flex-nowrap items-center gap-2 overflow-x-scroll"
        >
          {CategoryGroup.map((category) => (
            <li key={category.id}>
              <RadioInput
                name="category"
                id={category.id}
                label={category.label}
                checked={radio === category.id}
                onChange={(e) => setRadio(e.currentTarget.id)}
              />
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-4 lg:grid lg:grid-cols-5">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <li key={i}>
                <CardSkeleton />
              </li>
            ))}
          {!isLoading &&
            hotels.map((hotel) => (
              <li key={hotel.hotelId} className="w-full">
                <HotelSimpleCard
                  hotelId={hotel.hotelId}
                  name={hotel.name}
                  address={hotel.address}
                  mainImageUrl={hotel.mainImageUrl}
                  starLevel={hotel.starLevel}
                  minPrice={hotel.minPrice}
                />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default HomePage;
