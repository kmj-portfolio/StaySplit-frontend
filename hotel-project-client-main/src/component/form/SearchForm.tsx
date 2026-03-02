import LocationInput from '../search/LocationInput';
import DateInput from '../search/DateInput';
import PersonnelInput from '../search/PersonnelInput';
import { PrimaryButton } from '../common/button/PrimaryButton';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { SearchSchema, type SearchType } from '@/schema/SearchSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import buildSearchQuery from '@/utils/buildSearchQuery';
import getCoordsByAddress from '@/service/api/geocorder/getCoordsByAddress';
import { formatDateToISOstring } from '@/utils/format/formatUtil';
import { useState } from 'react';

interface SearchFormProps {
  location?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: string;
}

export interface DateRange {
  from: string;
  to?: string;
}

const SearchForm = ({ location, checkInDate, checkOutDate, guestCount }: SearchFormProps) => {
  const navigate = useNavigate();
  const [geoError, setGeoError] = useState('');

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(SearchSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      location: location || '서울',
      checkInDate: checkInDate || formatDateToISOstring(new Date()),
      checkOutDate:
        checkOutDate || formatDateToISOstring(new Date(Date.now() + 24 * 60 * 60 * 1000)),
      guestCount: guestCount || '1',
    },
  });

  const onSubmit = async (data: SearchType) => {
    setGeoError('');
    try {
      const { lat, lon } = await getCoordsByAddress(data.location);
      navigate(`/search?${buildSearchQuery({ ...data, lat, lon })}`);
    } catch {
      setGeoError(`"${data.location}"의 위치를 찾을 수 없습니다. 다른 지역명을 입력해주세요.`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-4 w-full"
    >
      {geoError && (
        <p className="mb-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{geoError}</p>
      )}
      <div className="bg-gray-primary/30 md:bg-gray-primary/60 flex w-full flex-col space-y-2.5 rounded-2xl p-4 md:flex-row md:gap-2 md:space-y-0">
      <LocationInput name="location" control={control} />
      <DateInput checkInName="checkInDate" checkOutName="checkOutDate" control={control} />
      <PersonnelInput name="guestCount" control={control} />
      <PrimaryButton size="lg" bold>
        <span className="md:hidden">검색</span>
        <span className="hidden md:block">
          <Search />
        </span>
      </PrimaryButton>
      </div>
    </form>
  );
};

export default SearchForm;
