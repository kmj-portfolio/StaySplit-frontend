import { getSearchHotels } from '@/service/api/hotel';
import { useQuery } from '@tanstack/react-query';

const REGION_COORDS: Record<string, { latitude: number; longitude: number }> = {
  seoul: { latitude: 37.5638, longitude: 126.9977 },
  busan: { latitude: 35.1631, longitude: 129.1635 },
  jeju: { latitude: 33.2496, longitude: 126.4131 },
};

const getTomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const getDayAfterStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
};

const useGetPopularHotels = (region: string) => {
  const coords = REGION_COORDS[region] ?? REGION_COORDS.seoul;

  return useQuery({
    queryKey: ['hotels', 'popular', region],
    queryFn: () =>
      getSearchHotels(
        {
          checkIn: getTomorrowStr(),
          checkOut: getDayAfterStr(),
          latitude: coords.latitude,
          longitude: coords.longitude,
          numGuest: 2,
          minPrice: 0,
          maxPrice: 999999999,
          numStar: [],
        },
        0,
        5,
      ),
    staleTime: 1000 * 60 * 5,
  });
};

export default useGetPopularHotels;
