import { Link } from 'react-router-dom';
import Logo from '@/assets/svg/Logo.svg';

const Footer = () => {
  return (
    <footer className="hidden border-t border-gray-200 bg-white md:block">
      <div className="mx-auto max-w-[1400px] px-8 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* 브랜드 */}
          <div className="flex flex-col gap-3">
            <img src={Logo} alt="StaySplit 로고" className="w-[120px]" />
            <p className="text-sm text-gray-500">가장 합리적인 호텔 예약, StaySplit</p>
          </div>

          {/* 링크 */}
          <div className="flex gap-16 text-sm">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-gray-700">서비스</p>
              <Link to="/" className="text-gray-500 hover:text-gray-800 transition-colors">홈</Link>
              <Link to="/search" className="text-gray-500 hover:text-gray-800 transition-colors">숙소 검색</Link>
              <Link to="/mypage/bookings" className="text-gray-500 hover:text-gray-800 transition-colors">예약 내역</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-gray-700">고객지원</p>
              <Link to="/mypage/support" className="text-gray-500 hover:text-gray-800 transition-colors">고객센터</Link>
              <a href="mailto:support@splitnstay.com" className="text-gray-500 hover:text-gray-800 transition-colors">이메일 문의</a>
              <span className="text-gray-500">1588-0000</span>
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="mt-8 flex flex-col gap-2 border-t border-gray-100 pt-6 text-xs text-gray-400 md:flex-row md:justify-between">
          <p>© 2026 StaySplit. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-gray-600 transition-colors">이용약관</span>
            <span className="cursor-pointer hover:text-gray-600 transition-colors">개인정보처리방침</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
