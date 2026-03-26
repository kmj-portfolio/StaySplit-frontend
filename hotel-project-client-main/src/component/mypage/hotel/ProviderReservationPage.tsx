import { useCallback, useEffect, useState } from 'react';
import { getProviderReservations } from '@/service/api/reservation';
import type {
  ProviderReservation,
  ProviderReservationSearchCondition,
  ReservationStatus,
} from '@/types/ReservationType';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

type TabLabel = '전체' | '결제 대기' | '예약 완료' | '이용 완료' | '예약 취소';

const TAB_STATUS_MAP: Record<TabLabel, ReservationStatus | undefined> = {
  전체: undefined,
  '결제 대기': 'WAITING_PAYMENT',
  '예약 완료': 'CONFIRMED',
  '이용 완료': 'COMPLETE',
  '예약 취소': 'CANCELLED',
};

const STATUS_LABEL: Record<ReservationStatus, string> = {
  WAITING_PAYMENT: '결제 대기',
  CONFIRMED: '예약 완료',
  CANCELLED: '예약 취소',
  EXPIRED: '만료',
  COMPLETE: '이용 완료',
};

const STATUS_COLOR: Record<ReservationStatus, string> = {
  WAITING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-600',
  EXPIRED: 'bg-gray-100 text-gray-500',
  COMPLETE: 'bg-green-100 text-green-700',
};

const TABS: TabLabel[] = ['전체', '결제 대기', '예약 완료', '이용 완료', '예약 취소'];
const PAGE_SIZE = 10;

const ProviderReservationPage = () => {
  const [activeTab, setActiveTab] = useState<TabLabel>('전체');
  const [reservations, setReservations] = useState<ProviderReservation[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchForm, setSearchForm] = useState({
    reservationNumber: '',
    guestName: '',
    guestEmail: '',
    checkInStart: '',
    checkInEnd: '',
  });

  const [appliedConditions, setAppliedConditions] =
    useState<ProviderReservationSearchCondition>({});

  const fetchReservations = useCallback(
    async (conditions: ProviderReservationSearchCondition, currentPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const status = TAB_STATUS_MAP[activeTab];
        const response = await getProviderReservations(
          { ...conditions, ...(status ? { reservationStatus: status } : {}) },
          currentPage,
          PAGE_SIZE,
        );
        setReservations(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (e) {
        setError(typeof e === 'string' ? e : '예약 내역을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    },
    [activeTab],
  );

  useEffect(() => {
    fetchReservations(appliedConditions, page);
  }, [fetchReservations, appliedConditions, page]);

  const handleTabChange = (tab: TabLabel) => {
    setActiveTab(tab);
    setPage(0);
  };

  const handleSearch = () => {
    const conditions: ProviderReservationSearchCondition = {};
    if (searchForm.reservationNumber) conditions.reservationNumber = searchForm.reservationNumber;
    if (searchForm.guestName) conditions.guestName = searchForm.guestName;
    if (searchForm.guestEmail) conditions.guestEmail = searchForm.guestEmail;
    if (searchForm.checkInStart) conditions.checkInStart = searchForm.checkInStart;
    if (searchForm.checkInEnd) conditions.checkInEnd = searchForm.checkInEnd;
    setAppliedConditions(conditions);
    setPage(0);
  };

  const handleReset = () => {
    setSearchForm({
      reservationNumber: '',
      guestName: '',
      guestEmail: '',
      checkInStart: '',
      checkInEnd: '',
    });
    setAppliedConditions({});
    setPage(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">예약 관리</h1>
        <span className="text-sm text-gray-500">총 {totalElements}건</span>
      </div>

      {/* 검색 필터 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">예약 번호</label>
            <input
              type="text"
              placeholder="예약 번호 입력"
              value={searchForm.reservationNumber}
              onChange={(e) =>
                setSearchForm((prev) => ({ ...prev, reservationNumber: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">예약자 이름</label>
            <input
              type="text"
              placeholder="예약자 이름 입력"
              value={searchForm.guestName}
              onChange={(e) => setSearchForm((prev) => ({ ...prev, guestName: e.target.value }))}
              onKeyDown={handleKeyDown}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">예약자 이메일</label>
            <input
              type="text"
              placeholder="이메일 입력"
              value={searchForm.guestEmail}
              onChange={(e) => setSearchForm((prev) => ({ ...prev, guestEmail: e.target.value }))}
              onKeyDown={handleKeyDown}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">체크인 시작</label>
            <input
              type="date"
              value={searchForm.checkInStart}
              onChange={(e) =>
                setSearchForm((prev) => ({ ...prev, checkInStart: e.target.value }))
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">체크인 종료</label>
            <input
              type="date"
              value={searchForm.checkInEnd}
              onChange={(e) => setSearchForm((prev) => ({ ...prev, checkInEnd: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              className="flex flex-1 items-center justify-center gap-1 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              검색
            </button>
            <button
              onClick={handleReset}
              className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="mb-4 flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="py-16 text-center text-gray-400">불러오는 중...</div>
      ) : error ? (
        <div className="py-16 text-center text-red-400">{error}</div>
      ) : reservations.length === 0 ? (
        <div className="py-16 text-center text-gray-400">예약 내역이 없습니다.</div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">예약 번호</th>
                <th className="px-4 py-3 text-left">예약자</th>
                <th className="px-4 py-3 text-left">체크인</th>
                <th className="px-4 py-3 text-left">체크아웃</th>
                <th className="px-4 py-3 text-right">숙박</th>
                <th className="px-4 py-3 text-right">결제 금액</th>
                <th className="px-4 py-3 text-center">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservations.map((r) => (
                <tr key={r.reservationId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">
                    {r.reservationNumber}
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    <div>{r.participantNames[0] ?? '-'}</div>
                    {r.numberOfParticipants > 1 && (
                      <div className="text-xs text-gray-400">
                        외 {r.numberOfParticipants - 1}명
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{r.checkInDate}</td>
                  <td className="px-4 py-3 text-gray-700">{r.checkOutDate}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{r.nights}박</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-800">
                    {r.totalPrice.toLocaleString()}원
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[r.reservationStatus]}`}
                    >
                      {STATUS_LABEL[r.reservationStatus]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`h-8 w-8 rounded text-sm font-medium ${
                i === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default ProviderReservationPage;
