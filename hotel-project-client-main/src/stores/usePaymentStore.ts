import { create } from 'zustand';

interface PaymentState {
  paymentModal: boolean;
  togglePayment: () => void;
  reservationId: number;
  setReservationId: (reservationId: number) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  paymentModal: false,
  togglePayment: () => set((state) => ({ paymentModal: !state.paymentModal })),
  reservationId: 0,
  setReservationId: (reservationId) => set({ reservationId }),
}));
