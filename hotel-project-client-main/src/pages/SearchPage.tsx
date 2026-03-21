import HotelCard from '@/component/card/HotelCard';
import CardSkeleton from '@/component/common/card/ui/CardSkeleton';
import SearchFilterBar, { type FilterState } from '@/component/hotels/SearchFilterBar';
import hotelKeys from '@/hooks/queries/hotels/hotelKeys';
import useObserver from '@/hooks/useObserver';
import type { SearchTerm } from '@/layout/SearchLayout';
import { getSearchHotels } from '@/service/api/hotel';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { SearchX } from 'lucide-react';

const SearchPage = () => {
  const { location, lat, lon, guestCount, checkInDate, checkOutDate } =
    useRouteLoaderData<SearchTerm>('search')!;

  const [filter, setFilter] = useState<FilterState>({
    numStar: 0,
    minPrice: 0,
    maxPrice: 999999999,
  });

  const { data, hasNextPage, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: [
      ...hotelKeys.searchHotels({ location, guestCount, checkInDate, checkOutDate }),
      filter,
    ],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      return await getSearchHotels(
        {
          checkIn: checkInDate,
          checkOut: checkOutDate,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          numGuest: parseInt(guestCount),
          minPrice: filter.minPrice,
          maxPrice: filter.maxPrice,
          numStar: filter.numStar,
        },
        pageParam,
        10,
      );
    },
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.pageable.pageNumber + 1;
    },
  });

  const { ref, isView } = useObserver();

  useEffect(() => {
    if (isView && hasNextPage) {
      fetchNextPage();
    }
  }, [isView, fetchNextPage, hasNextPage]);

  const searchResults = data?.pages.flatMap((page) => page.content) || [];
  const totalCount = data?.pages[0]?.totalElements;

  return (
    <div className="flex gap-4 px-4 pb-8">
      {/* 호텔 목록 */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {!isLoading && totalCount !== undefined && (
          <p className="text-sm text-gray-400">
            {location && <span className="font-medium text-gray-600">"{location}" </span>}
            검색 결과 <span className="font-semibold text-gray-700">{totalCount}</span>개
          </p>
        )}

        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && searchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <SearchX className="mb-4 h-14 w-14 opacity-25" />
            <p className="text-base font-semibold text-gray-500">검색 결과가 없습니다</p>
            <p className="mt-1 text-sm text-gray-400">
              {location ? (
                <><span className="font-medium text-gray-500">"{location}"</span> 주변 5km 이내 호텔을 찾지 못했습니다.</>
              ) : (
                '다른 지역이나 날짜로 다시 검색해보세요.'
              )}
            </p>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <ul className="flex flex-col gap-3">
            {searchResults.map((hotel) => (
              <li key={hotel.hotelId}>
                <HotelCard
                  {...hotel}
                  liked={true}
                  handleChangeLike={() => {}}
                  checkIn={checkInDate}
                  checkOut={checkOutDate}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="min-h-[1px] w-full" ref={ref} />
      </div>

      {/* 필터 사이드바 */}
      <aside className="w-56 shrink-0">
        <div className="sticky top-4">
          <SearchFilterBar filter={filter} onChange={setFilter} />
        </div>
      </aside>
    </div>
  );
};

export default SearchPage;
