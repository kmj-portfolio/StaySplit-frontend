import { formatNumberWithComma } from '@/utils/format/formatUtil';

const STAR_OPTIONS = [
  { label: '전체', value: 0, stars: 0 },
  { label: '1성급', value: 1, stars: 1 },
  { label: '2성급', value: 2, stars: 2 },
  { label: '3성급', value: 3, stars: 3 },
  { label: '4성급', value: 4, stars: 4 },
  { label: '5성급', value: 5, stars: 5 },
];

const PRICE_MIN = 0;
const PRICE_MAX = 3000000;
const PRICE_STEP = 10000;

const PRICE_PRESETS = [
  { label: '전체', min: 0, max: 999999999 },
  { label: '10만원 이하', min: 0, max: 100000 },
  { label: '10~20만원', min: 100000, max: 200000 },
  { label: '20~30만원', min: 200000, max: 300000 },
  { label: '30~50만원', min: 300000, max: 500000 },
  { label: '50만원 이상', min: 500000, max: 999999999 },
];

export interface FilterState {
  numStar: number[];
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
        <div className="flex flex-col gap-1.5">
          {STAR_OPTIONS.map((opt) => {
            const isActive =
              opt.value === 0
                ? filter.numStar.length === 0
                : filter.numStar.includes(opt.value);

            const handleClick = () => {
              if (opt.value === 0) {
                onChange({ ...filter, numStar: [] });
              } else {
                const next = isActive
                  ? filter.numStar.filter((s) => s !== opt.value)
                  : [...filter.numStar, opt.value];
                onChange({ ...filter, numStar: next });
              }
            };

            return (
              <button
                key={opt.value}
                type="button"
                onClick={handleClick}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <span className="text-xs">
                  {opt.stars > 0 && '⭐'.repeat(opt.stars)}
                </span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-gray-200" />

      {/* 가격 */}
      <div>
        <p className="mb-2.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">가격</p>
        <div className="mb-3 flex items-center gap-2 text-sm">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₩</span>
            <input
              type="number"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={filter.minPrice}
              onChange={(e) => {
                const val = Math.max(PRICE_MIN, Math.min(Number(e.target.value), displayMax - PRICE_STEP));
                onChange({ ...filter, minPrice: val });
              }}
              className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-5 pr-2 text-xs font-semibold text-gray-700 focus:border-primary-400 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <span className="text-gray-300 shrink-0">~</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₩</span>
            <input
              type="number"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={displayMax}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), filter.minPrice + PRICE_STEP);
                const newMax = val >= PRICE_MAX ? 999999999 : val;
                onChange({ ...filter, maxPrice: newMax });
              }}
              className="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-5 pr-2 text-xs font-semibold text-gray-700 focus:border-primary-400 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
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

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const isActive = filter.minPrice === preset.min && filter.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onChange({ ...filter, minPrice: preset.min, maxPrice: preset.max })}
                className={`rounded-lg border py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'border-primary-500 bg-primary-500 text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
