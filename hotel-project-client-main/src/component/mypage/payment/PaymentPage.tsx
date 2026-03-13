import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, CreditCard, Clock, History } from 'lucide-react';
import { getMyPayments } from '@/service/api/payment';
import type { PaymentResponse, PaymentStatus } from '@/types/PaymentType';
import { formatNumberToWon } from '@/utils/format/formatUtil';

const STATUS_CONFIG: Record<PaymentStatus, { text: string; color: string }> = {
  PAID: { text: '결제완료', color: 'bg-blue-100 text-blue-800' },
  FAILED: { text: '결제실패', color: 'bg-red-100 text-red-800' },
  CANCELLED: { text: '결제취소', color: 'bg-gray-100 text-gray-800' },
};

const PaymentStatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status] ?? { text: status, color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

const PaymentDetailModal: React.FC<{
  payment: PaymentResponse | null;
  onClose: () => void;
}> = ({ payment, onClose }) => {
  if (!payment) return null;

  return (
    <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-gray-200 p-4">
      <div className="max-h-[70vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">결제 상세</h2>
          <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">총 결제 금액</span>
            <span className="text-2xl font-extrabold text-blue-600">
              {formatNumberToWon(payment.paymentAmount)}
            </span>
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-blue-300"></div>

        <div className="mb-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">결제 수단 정보</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">결제수단</span>
              <span className="font-medium">{payment.payMethod || '-'}</span>
            </div>
            {payment.cardPublisher && (
              <div className="flex justify-between">
                <span className="text-gray-600">카드사</span>
                <span className="font-medium">{payment.cardPublisher}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">결제 일시</span>
              <span className="font-medium">{payment.paidAt ? payment.paidAt.replace('T', ' ').slice(0, 16) : '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제 상태</span>
              <PaymentStatusBadge status={payment.status} />
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">예약 번호</span>
              <span className="font-medium">{payment.reservationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">결제 번호</span>
              <span className="font-medium">{payment.portOnePaymentId}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-red-500">
          결제 완료 후에는 결제 수단 변경이 불가능하오니 유의해주시기 바랍니다.
        </div>
      </div>
    </div>
  );
};

const PaymentItem: React.FC<{
  payment: PaymentResponse;
  onClick: (p: PaymentResponse) => void;
}> = ({ payment, onClick }) => (
  <div
    className="cursor-pointer rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
    onClick={() => onClick(payment)}
  >
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <CreditCard className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-600">예약번호: {payment.reservationNumber}</span>
      </div>
      <div className="flex items-center space-x-2">
        <PaymentStatusBadge status={payment.status} />
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </div>

    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Clock className="h-4 w-4" />
        <span>결제일: {payment.paidAt ? payment.paidAt.slice(0, 10) : '-'}</span>
        {payment.payMethod && <span>• {payment.payMethod}</span>}
      </div>
      <div className="text-xl font-bold text-blue-600">{formatNumberToWon(payment.paymentAmount)}</div>
    </div>
  </div>
);

const PaymentPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [selected, setSelected] = useState<PaymentResponse | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPayments = useCallback(async (p: number) => {
    setLoading(true);
    setError(undefined);
    try {
      const data = await getMyPayments(p, 10);
      setPayments(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments(page);
  }, [page, fetchPayments]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-800">결제 내역</h1>
        </div>
        <div className="flex items-center space-x-4">
          <History className="h-5 w-5 text-gray-600" />
          <span className="text-gray-600">지금까지의 결제 내역을 확인하실 수 있습니다.</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {loading ? (
          <div className="py-16 text-center text-gray-400">불러오는 중...</div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">{error}</div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center">
            <CreditCard className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">결제 내역이 없습니다</h3>
            <p className="text-gray-500">첫 번째 예약을 만들어보세요!</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {payments.map((p) => (
                <PaymentItem key={p.portOnePaymentId} payment={p} onClick={setSelected} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-40"
                >
                  이전
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  {page + 1} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-40"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <PaymentDetailModal payment={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default PaymentPage;
