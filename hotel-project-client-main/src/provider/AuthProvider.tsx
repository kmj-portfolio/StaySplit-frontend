/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from 'react';

import useAuthStore from '@/stores/useAuthStore';
import handleApiReqeust from '@/service/api/handleApiReqeust';
import client, { setAccessToken } from '@/service/instance/client';
import type { UserStatus, LoginResponse } from '@/types/user';
import { useLocation } from 'react-router-dom';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUserRole, setUserNickName, role } = useAuthStore();
  const location = useLocation();

  // 앱 시작 시 1회만 실행 — refreshToken 쿠키로 accessToken 복원
  const restoreAccessToken = async () => {
    try {
      const response = await handleApiReqeust<LoginResponse>(() =>
        client.post('/api/auth/refresh'),
      );
      setAccessToken(response.accessToken);
      setUserRole(response.role);
    } catch {
      // refreshToken 없음 or 만료 → 비로그인 상태 유지
      setAccessToken(null);
      setUserRole(null);
    }
  };

  // 로그인 상태 Check (라우트 변경마다)
  const handleCheckLoggedIn = async () => {
    try {
      const response = await handleApiReqeust<UserStatus>(() =>
        client.get('/api/auth/status'),
      );
      setUserRole(response.role);
    } catch {
      setUserRole(null);
      setUserNickName('');
    }
  };

  useEffect(() => {
    restoreAccessToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleCheckLoggedIn();
  }, [location.pathname]);

  return <>{children}</>;
};

export default AuthProvider;
