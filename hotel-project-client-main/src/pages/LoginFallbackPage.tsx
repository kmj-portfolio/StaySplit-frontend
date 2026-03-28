import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import type { SocialRegisterType } from '@/schema/AuthSchema';
import useAuthStore from '@/stores/useAuthStore';
import { googleOAuthLogin, SocialSignup } from '@/service/api/auth';
import type { UserRole } from '@/types/user';
import { getCustomerDetails, getProviderProfile } from '@/service/api/auth';

import SignupForm from '@/component/form/auth/SocialRegisterForm';
import Modal from '@/component/modal/Modal';
import ModalHeader from '@/component/modal/ModalHeader';
import ModalWrapper from '@/component/modal/ModalWrapper';
import { PrimaryButton } from '@/component/common/button/PrimaryButton';

interface Props {
  // When rendered at /api/auth/google/callback the identifier is not in params
  identifier?: string;
}

const LoginFallbackPage = ({ identifier: identifierProp }: Props) => {
  const { identifier: identifierParam } = useParams();
  const identifier = identifierProp ?? identifierParam;

  const [error, setError] = useState(false);
  const [modal, setModal] = useState(false);
  const [socialDefaults, setSocialDefaults] = useState<Partial<SocialRegisterType>>({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserRole, setUserNickName } = useAuthStore();

  const code = searchParams.get('code');

  // Redirect to Google OAuth consent screen
  const startGoogleAuth = () => {
    const url = new URL(import.meta.env.VITE_GOOGLE_AUTH_URL);
    url.searchParams.set('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    url.searchParams.set('redirect_uri', import.meta.env.VITE_GOOGLE_REDIRECT_URI);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'openid email profile');
    window.location.href = url.toString();
  };

  useEffect(() => {
    if (!code || !identifier) {
      navigate('/');
      return;
    }

    if (identifier !== 'google') {
      // Only Google is implemented in the backend
      setError(true);
      return;
    }

    const handleLogin = async () => {
      try {
        const result = await googleOAuthLogin(code);

        if (result.needsSignup) {
          setSocialDefaults({
            socialId: result.socialId ?? '',
            email: result.email ?? '',
            name: result.name ?? '',
          });
          setModal(true);
          return;
        }

        const role = result.role as UserRole;
        setUserRole(role);
        try {
          if (role === 'ROLE_PROVIDER') {
            const profile = await getProviderProfile();
            setUserNickName(profile.hotelName ?? '');
          } else {
            const details = await getCustomerDetails();
            setUserNickName(details.nickname);
          }
        } catch {
          // nickname fetch 실패해도 로그인은 계속 진행
        }
        navigate('/');
      } catch {
        setError(true);
      }
    };

    handleLogin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignupSubmit = async (data: SocialRegisterType) => {
    try {
      await SocialSignup(data);
    } catch (err) {
      return err as string;
    }

    // Google auth codes are one-time use — re-authenticate to get a JWT after signup
    startGoogleAuth();
  };

  if (error) {
    return (
      <section className="flex h-full flex-1 flex-col items-center justify-center">
        <div>
          <p className="mb-2">로그인 처리 중 오류가 발생했습니다.</p>
          <PrimaryButton size="sm" onClick={() => navigate('/')} full>
            홈으로 돌아가기
          </PrimaryButton>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full">
      {modal && (
        <Modal isOpen={modal} onClose={() => { setModal(false); setError(true); }} full>
          <ModalWrapper>
            <ModalHeader
              onClick={() => { setModal(false); setError(true); }}
              headerTitle="추가 정보 입력"
            />
            <div className="flex-1 py-4">
              <SignupForm onSubmit={handleSignupSubmit} defaultValues={socialDefaults} />
            </div>
            <PrimaryButton size="md" type="submit" form="sign-up-social" full>
              가입하기
            </PrimaryButton>
          </ModalWrapper>
        </Modal>
      )}
    </section>
  );
};

export default LoginFallbackPage;
