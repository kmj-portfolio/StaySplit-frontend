/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef } from 'react';

import useAuthStore from '@/stores/useAuthStore';
import handleApiReqeust from '@/service/api/handleApiReqeust';
import client, { setAccessToken } from '@/service/instance/client';
import { getCustomerDetails, getProviderProfile } from '@/service/api/auth';
import type { UserStatus, LoginResponse } from '@/types/user';
import { useLocation } from 'react-router-dom';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUserRole, setUserNickName, setTokenRestored, isTokenRestored } = useAuthStore();
  const location = useLocation();
  const isMounted = useRef(false);
  // Prevents the double-call that React 18 Strict Mode causes in development
  const isRestoringRef = useRef(false);

  // 앱 시작 시 1회만 실행 — refreshToken 쿠키로 accessToken 복원
  const restoreAccessToken = async () => {
    if (isRestoringRef.current) return;
    isRestoringRef.current = true;
    try {
      const response = await handleApiReqeust<LoginResponse>(() =>
        client.post('/api/auth/refresh'),
      );
      setAccessToken(response.accessToken);
      if (response.role) {
        setUserRole(response.role);
      }
      // Fetch nickname after token restore so MypageMenu always shows it
      const currentRole = response.role ?? useAuthStore.getState().role;
      try {
        if (currentRole === 'ROLE_PROVIDER') {
          const profile = await getProviderProfile();
          setUserNickName(profile.hotelName ?? '');
        } else if (currentRole === 'ROLE_CUSTOMER') {
          const details = await getCustomerDetails();
          setUserNickName(details.nickname);
        }
      } catch {
        // nickname fetch failing shouldn't break auth restore
      }
    } catch {
      setAccessToken(null);
    } finally {
      setTokenRestored();
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
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    // Don't check auth status while token restoration is still in progress
    if (!isTokenRestored) return;
    handleCheckLoggedIn();
  }, [location.pathname]);

  return <>{children}</>;
};

export default AuthProvider;
