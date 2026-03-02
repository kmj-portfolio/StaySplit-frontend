import axios from 'axios';

/**
 * Nominatim(OpenStreetMap) 기반 지오코딩
 * - API 키 불필요, CORS 지원
 * - 국내: countrycodes=kr + Accept-Language: ko 로 정확도 향상
 * - 해외: 영문 주소 그대로 검색
 */

interface NominatimResult {
  lat: string;
  lon: string;
}

const geocode = async (
  address: string,
  options: { countrycodes?: string } = {},
): Promise<{ latitude: number; longitude: number }> => {
  const response = await axios.get<NominatimResult[]>(
    'https://nominatim.openstreetmap.org/search',
    {
      params: {
        format: 'json',
        q: address,
        limit: 1,
        ...options,
      },
      headers: { 'Accept-Language': options.countrycodes === 'kr' ? 'ko' : 'en' },
    },
  );

  const result = response.data[0];
  if (!result) {
    throw new Error('주소를 찾을 수 없습니다. 정확한 주소를 입력해주세요.');
  }

  return {
    latitude: parseFloat(result.lat),
    longitude: parseFloat(result.lon),
  };
};

/** 국내 주소 (카카오 우편번호 API로 선택된 주소) */
export const geocodeAddress = (address: string) =>
  geocode(address, { countrycodes: 'kr' });

/** 해외 주소 */
export const geocodeInternationalAddress = (address: string) => geocode(address);

/** 에러 메시지 추출 헬퍼 */
export const toErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string' && err.trim()) return err;
  return '오류가 발생했습니다.';
};
