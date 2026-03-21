import { formatNumberWithComma } from '@/utils/format/formatUtil';

const STAR_OPTIONS = [
  { label: '전체', value: 0 },
  { label: '1성급', value: 1 },
  { label: '2성급', value: 2 },
  { label: '3성급', value: 3 },
  { label: '4성급', value: 4 },
  { label: '5성급', value: 5 },
];

const PRICE_MIN = 0;
const PRICE_MAX = 3000000;
const PRICE_STEP = 10000;

export interface FilterState {
  numStar: number;
  minPrice: number;
  maxPrice: number;
}

interface SearchFilterBarProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
}

const SearchFilterBar = ({ filter, onChange }: SearchFilterBarProps) => {
  const displayMax = filter.maxPrice >= 999999999 ? PRICE_MAX : filter.maxPrice;

  const minPercent = ((filter.minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((displayMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), displayMax - PRICE_STEP);
    onChange({ ...filter, minPrice: val });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), filter.minPrice + PRICE_STEP);
    const newMax = val >= PRICE_MAX ? 999999999 : val;
    onChange({ ...filter, maxPrice: newMax });
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-gray-50 p-4">
      {/* 성급 */}
      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">성급</p>
        <div className="grid grid-cols-3 gap-1.5">
          {STAR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...filter, numStar: opt.value })}
              className={`rounded-lg border py-2 text-sm font-medium transition-all ${
                filter.numStar === opt.value
                  ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* 가격 */}
      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">가격</p>
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-700">₩{formatNumberWithComma(filter.minPrice)}</span>
          <span className="text-gray-300">~</span>
          <span className="font-semibold text-gray-700">
            {filter.maxPrice >= 999999999
              ? `₩${formatNumberWithComma(PRICE_MAX)}+`
              : `₩${formatNumberWithComma(filter.maxPrice)}`}
          </span>
        </div>

        <div className="relative h-5 w-full">
          <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200" />
          <div
            className="bg-primary-400 absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={filter.minPrice}
            onChange={handleMinChange}
            className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={displayMax}
            onChange={handleMaxChange}
            className="pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        <div className="mt-1 flex justify-between text-xs text-gray-400">
          <span>₩0</span>
          <span>₩{formatNumberWithComma(PRICE_MAX)}+</span>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
