import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';

/* ── Daum Postcode 타입 ─────────────────────────────────────── */

interface DaumPostcodeData {
  roadAddress: string;   // 도로명 주소
  jibunAddress: string;  // 지번 주소
  address: string;       // 최종 주소 (roadAddress 우선)
  buildingName: string;
  zonecode: string;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (config: { oncomplete: (data: DaumPostcodeData) => void }) => { open: () => void };
    };
  }
}

/* ── 스크립트 동적 로드 ──────────────────────────────────────── */

const POSTCODE_SCRIPT_ID = 'kakao-postcode-script';
const POSTCODE_SCRIPT_URL = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

const loadPostcodeScript = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (window.daum?.Postcode) {
      resolve();
      return;
    }
    const existing = document.getElementById(POSTCODE_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = POSTCODE_SCRIPT_ID;
    script.src = POSTCODE_SCRIPT_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('우편번호 서비스를 불러오지 못했습니다.'));
    document.head.appendChild(script);
  });

/* ── KakaoAddressInput 컴포넌트 ─────────────────────────────── */

interface KakaoAddressInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
}

const KakaoAddressInput = <T extends FieldValues>({
  name,
  control,
  label,
}: KakaoAddressInputProps<T>) => {
  const { field, fieldState } = useController({ name, control });

  const [roadAddress, setRoadAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  // 내부에서 마지막으로 field.onChange에 넘긴 값을 추적해 무한루프 방지
  const lastSetRef = useRef('');
  const detailRef = useRef<HTMLInputElement>(null);

  // 외부 변경(폼 리셋 등) → 내부 상태 동기화
  useEffect(() => {
    if (field.value !== lastSetRef.current) {
      setRoadAddress(field.value ?? '');
      setDetailAddress('');
      lastSetRef.current = field.value ?? '';
    }
  }, [field.value]);

  const pushFieldValue = (road: string, detail: string) => {
    const combined = detail ? `${road} ${detail}` : road;
    lastSetRef.current = combined;
    field.onChange(combined);
  };

  const openPostcode = async () => {
    try {
      await loadPostcodeScript();
      new window.daum.Postcode({
        oncomplete: (data) => {
          const addr = data.roadAddress || data.address;
          setRoadAddress(addr);
          setDetailAddress('');
          pushFieldValue(addr, '');
          setTimeout(() => detailRef.current?.focus(), 80);
        },
      }).open();
    } catch {
      alert('주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const detail = e.target.value;
    setDetailAddress(detail);
    pushFieldValue(roadAddress, detail);
  };

  const hasError = !!fieldState.error;

  return (
    <div className="space-y-2">
      {label && (
        <label className="mb-1 block text-black" htmlFor={`${name}-detail`}>
          {label}
        </label>
      )}

      {/* 주소 검색 영역 */}
      <div className="flex gap-2">
        <input
          type="text"
          readOnly
          value={roadAddress}
          placeholder="주소 검색 버튼을 눌러주세요"
          onClick={openPostcode}
          className={`focus:border-primary-300 flex-1 cursor-pointer rounded-xl border bg-gray-50 px-4 py-2 text-black outline-none transition-colors ${
            hasError ? 'border-[#e57373]' : 'border-gray-200'
          }`}
        />
        <button
          type="button"
          onClick={openPostcode}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          <Search className="h-4 w-4" />
          주소 검색
        </button>
      </div>

      {/* 상세주소 (도로명 선택 후에만 표시) */}
      {roadAddress && (
        <input
          ref={detailRef}
          id={`${name}-detail`}
          type="text"
          value={detailAddress}
          onChange={handleDetailChange}
          placeholder="상세주소를 입력해주세요 (선택)"
          className="focus:border-primary-300 w-full rounded-xl border border-gray-200 px-4 py-2 text-black outline-none transition-colors"
        />
      )}

      {hasError && fieldState.error?.message && (
        <span className="text-error inline-block pt-1 text-sm">{fieldState.error.message}</span>
      )}
    </div>
  );
};

export default KakaoAddressInput;
