import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Pencil, Trash2, Check, X } from 'lucide-react';

import { getCustomerDetails } from '@/service/api/auth';
import { getCustomerReviews, updateReview, deleteReview } from '@/service/api/review';
import type { Review } from '@/types/review/review';

const StarRating = ({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) => {
  const [hovered, setHovered] = useState(0);
  const display = hovered || rating;

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${display >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} ${onChange ? 'cursor-pointer' : ''}`}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
        />
      ))}
    </div>
  );
};

const ReviewCard = ({
  review,
  onUpdated,
  onDeleted,
  customerId,
}: {
  review: Review;
  onUpdated: (updated: Review) => void;
  onDeleted: (reviewId: number) => void;
  customerId: number;
}) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(review.content);
  const [rating, setRating] = useState(review.rating);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await updateReview(review.reviewId, { customerId, content, rating });
      onUpdated({ ...review, content, rating });
      setEditing(false);
      setError('');
    } catch (err) {
      setError(err as string);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;
    try {
      await deleteReview(review.reviewId, customerId);
      onDeleted(review.reviewId);
    } catch (err) {
      setError(err as string);
    }
  };

  const handleCancel = () => {
    setContent(review.content);
    setRating(review.rating);
    setEditing(false);
    setError('');
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <Link
            to={`/hotels/${review.hotelId}`}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            호텔 #{review.hotelId}
          </Link>
          {editing ? (
            <StarRating rating={rating} onChange={setRating} />
          ) : (
            <StarRating rating={review.rating} />
          )}
        </div>
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg p-1.5 text-green-600 hover:bg-green-50"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-blue-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-blue-400"
          rows={4}
        />
      ) : (
        <p className="text-sm leading-relaxed text-gray-700">{review.content}</p>
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const ReviewsPage = () => {
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const details = await getCustomerDetails();
        setCustomerId(details.id);
        const page = await getCustomerReviews(details.id);
        setReviews(page.content);
      } catch {
        setError('리뷰를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleUpdated = (updated: Review) => {
    setReviews((prev) => prev.map((r) => (r.reviewId === updated.reviewId ? updated : r)));
  };

  const handleDeleted = (reviewId: number) => {
    setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
  };

  if (loading) {
    return <div className="py-16 text-center text-gray-400">불러오는 중...</div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-800">나의 리뷰</h1>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      {reviews.length === 0 ? (
        <div className="py-16 text-center text-gray-400">
          <Star className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p>작성한 리뷰가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.reviewId}
              review={review}
              customerId={customerId!}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
