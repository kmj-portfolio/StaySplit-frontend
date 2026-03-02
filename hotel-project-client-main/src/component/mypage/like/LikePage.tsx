import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, X, Hotel } from 'lucide-react';

import { getCustomerDetails } from '@/service/api/auth';
import {
  getCustomerLikeLists,
  createLikeList,
  deleteLikeList,
  getHotelsInLikeList,
  removeHotelFromLikeList,
  type LikeListEntity,
  type LikeHotelItem,
} from '@/service/api/likeList';
import { PrimaryButton } from '@/component/common/button/PrimaryButton';

const LikePage = () => {
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [lists, setLists] = useState<LikeListEntity[]>([]);
  const [selectedList, setSelectedList] = useState<LikeListEntity | null>(null);
  const [hotels, setHotels] = useState<LikeHotelItem[]>([]);
  const [newListName, setNewListName] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const details = await getCustomerDetails();
        setCustomerId(details.id);
        const data = await getCustomerLikeLists(details.id);
        setLists(data);
      } catch {
        setError('목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSelectList = async (list: LikeListEntity) => {
    setSelectedList(list);
    setHotelsLoading(true);
    try {
      const page = await getHotelsInLikeList(list.id);
      setHotels(page.content);
    } catch {
      setHotels([]);
    } finally {
      setHotelsLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!customerId || !newListName.trim()) return;
    try {
      const created = await createLikeList(customerId, newListName.trim());
      setLists((prev) => [...prev, created]);
      setNewListName('');
      setCreating(false);
    } catch {
      setError('목록 생성에 실패했습니다.');
    }
  };

  const handleDeleteList = async (likeListId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteLikeList(likeListId);
      setLists((prev) => prev.filter((l) => l.id !== likeListId));
      if (selectedList?.id === likeListId) {
        setSelectedList(null);
        setHotels([]);
      }
    } catch {
      setError('목록 삭제에 실패했습니다.');
    }
  };

  const handleRemoveHotel = async (likeListId: number, hotelId: number) => {
    try {
      await removeHotelFromLikeList(likeListId, hotelId);
      setHotels((prev) => prev.filter((h) => h.hotelId !== hotelId));
    } catch {
      setError('호텔 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-400">불러오는 중...</div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">찜 목록</h1>
        <PrimaryButton size="sm" onClick={() => setCreating(true)}>
          <Plus className="mr-1 inline h-4 w-4" />
          새 목록
        </PrimaryButton>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      {/* 새 목록 생성 */}
      {creating && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="목록 이름을 입력하세요"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
            autoFocus
          />
          <PrimaryButton size="sm" onClick={handleCreateList}>
            만들기
          </PrimaryButton>
          <button
            onClick={() => { setCreating(false); setNewListName(''); }}
            className="rounded-lg p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 목록이 없을 때 */}
      {lists.length === 0 && !creating && (
        <div className="py-16 text-center text-gray-400">
          <Hotel className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p>찜한 목록이 없습니다.</p>
          <p className="mt-1 text-sm">새 목록을 만들어 호텔을 저장해보세요!</p>
        </div>
      )}

      <div className="flex gap-6">
        {/* 목록 사이드바 */}
        {lists.length > 0 && (
          <div className="w-64 flex-shrink-0">
            <div className="space-y-2">
              {lists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => handleSelectList(list)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                    selectedList?.id === list.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate text-sm font-medium text-gray-800">
                    {list.listName}
                  </span>
                  <button
                    onClick={(e) => handleDeleteList(list.id, e)}
                    className="ml-2 flex-shrink-0 text-gray-300 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 호텔 목록 */}
        {selectedList && (
          <div className="flex-1">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">
              {selectedList.listName}
            </h2>

            {hotelsLoading ? (
              <p className="text-center text-gray-400">불러오는 중...</p>
            ) : hotels.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center text-gray-400">
                <Hotel className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p>이 목록에 저장된 호텔이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <Link
                      to={`/hotels/${hotel.hotelId}`}
                      className="text-blue-600 hover:underline"
                    >
                      호텔 #{hotel.hotelId}
                    </Link>
                    <button
                      onClick={() => handleRemoveHotel(selectedList.id, hotel.hotelId)}
                      className="text-gray-300 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikePage;
