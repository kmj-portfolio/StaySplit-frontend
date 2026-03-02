import axios from 'axios';

/**
 * Nominatim(OpenStreetMap)을 통해 주소의 좌표값을 패칭하는 함수
 *
 * @param address
 * @returns lat, lon
 */
const getCoordsByAddress = async (address: string): Promise<{ lat: string; lon: string }> => {
  const response = await axios.get<{ lat: string; lon: string }[]>(
    'https://nominatim.openstreetmap.org/search',
    {
      params: { format: 'json', q: address, limit: 1, countrycodes: 'kr' },
      headers: { 'Accept-Language': 'ko' },
    },
  );

  const result = response.data[0];
  if (!result) {
    throw new Error(`"${address}"의 위치를 찾을 수 없습니다.`);
  }

  return { lat: result.lat, lon: result.lon };
};

export default getCoordsByAddress;
