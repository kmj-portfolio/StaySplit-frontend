import { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Phone, Clock } from 'lucide-react';

const faqs = [
  {
    question: '예약을 취소하려면 어떻게 하나요?',
    answer:
      '예약 내역 페이지에서 취소하실 예약을 선택한 후 취소 버튼을 클릭하시면 됩니다. 취소 정책에 따라 환불 금액이 달라질 수 있으니 예약 상세 페이지에서 취소 정책을 확인해 주세요.',
  },
  {
    question: '환불은 언제 처리되나요?',
    answer:
      '취소 요청 후 영업일 기준 3~5일 이내에 결제하신 수단으로 환불이 처리됩니다. 카드사에 따라 실제 환불 반영까지 추가 시간이 소요될 수 있습니다.',
  },
  {
    question: '비밀번호를 잊어버렸어요.',
    answer:
      '로그인 화면에서 "비밀번호 찾기"를 클릭하시면 가입하신 이메일로 재설정 링크가 발송됩니다. 이메일을 확인하신 후 안내에 따라 비밀번호를 재설정해 주세요.',
  },
  {
    question: '예약 확인서는 어디서 받을 수 있나요?',
    answer:
      '예약 완료 후 가입하신 이메일로 예약 확인서가 자동 발송됩니다. 예약 내역 페이지에서도 예약 상세 정보를 확인하실 수 있습니다.',
  },
  {
    question: '숙소 체크인/체크아웃 시간은 어떻게 되나요?',
    answer:
      '체크인·체크아웃 시간은 숙소마다 다릅니다. 예약하신 숙소의 상세 페이지 또는 예약 확인서에서 해당 숙소의 체크인·체크아웃 시간을 확인해 주세요.',
  },
];

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-none">
      <button
        className="flex w-full cursor-pointer items-center justify-between py-4 text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="font-medium text-gray-800">{question}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
        )}
      </button>
      {open && <p className="pb-4 text-sm leading-relaxed text-gray-600">{answer}</p>}
    </div>
  );
};

const SupportPage = () => {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">고객센터</h1>

      {/* 연락처 */}
      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">문의하기</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary-500 shrink-0" />
            <div>
              <p className="text-sm text-gray-500">전화 문의</p>
              <p className="font-medium text-gray-800">1588-0000</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary-500 shrink-0" />
            <div>
              <p className="text-sm text-gray-500">이메일 문의</p>
              <p className="font-medium text-gray-800">support@splitnstay.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary-500 shrink-0" />
            <div>
              <p className="text-sm text-gray-500">운영 시간</p>
              <p className="font-medium text-gray-800">평일 09:00 – 18:00 (주말·공휴일 휴무)</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">자주 묻는 질문</h2>
        <div>
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
