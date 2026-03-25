import client, { setAccessToken } from '@/service/instance/client';

import handleApiReqeust from './handleApiReqeust';

import type { UserRole, UserInfo, UserStatus, LoginResponse, CustomerDetails, ProviderProfile, GoogleLoginResponse } from '@/types/user';
import type { GeneralRegisterType, ProviderRegisterType, LoginType, SocialRegisterType, ChangePasswordType } from '@/schema/AuthSchema';

const getSignUpApiUrl = (role: UserRole) => {
  if (role === 'ROLE_CUSTOMER') {
    return '/api/customers/sign-up';
  } else {
    return '/api/providers/sign-up';
  }
};

export const GeneralSignup = async (role: UserRole, data: GeneralRegisterType | ProviderRegisterType) => {
  const payload = 'phoneNumber' in data && data.phoneNumber
    ? { ...data, phoneNumber: data.phoneNumber.replace(/-/g, '') }
    : data;
  const response = await handleApiReqeust<UserInfo>(() => client.post(getSignUpApiUrl(role), payload));

  return response;
};

export const SocialSignup = async (data: SocialRegisterType) => {
  const phoneNumber = 'phoneNumber' in data && data.phoneNumber
    ? data.phoneNumber.replace(/-/g, '')
    : undefined;
  const response = await handleApiReqeust<LoginResponse>(() =>
    client.post('/api/oauth/signup', { ...data, phoneNumber }),
  );

  return response;
};

export const login = async (data: LoginType) => {
  const response = await handleApiReqeust<LoginResponse>(() => client.post('/api/auth/login', data));
  setAccessToken(response.accessToken);
  return response;
};

export const getAuthStatus = async () => {
  const response = await handleApiReqeust<UserStatus>(() => client.get('/api/auth/status'));
  return response;
};

export const getCustomerDetails = async () => {
  const response = await handleApiReqeust<CustomerDetails>(() => client.get('/api/customers/my'));
  return response;
};

export const getProviderProfile = async () => {
  const response = await handleApiReqeust<ProviderProfile>(() => client.get('/api/providers/profile'));
  return response;
};

export const updatePassword = async (data: Omit<ChangePasswordType, 'newPasswordConfirm'>) => {
  const response = await handleApiReqeust<string>(() => client.put('/api/auth/pw', data));
  return response;
};

export const updateNickname = async (nickname: string) => {
  const response = await handleApiReqeust<string>(() =>
    client.put('/api/customers/nickname', { nickname }),
  );
  return response;
};

export const logout = async () => {
  await handleApiReqeust<UserRole>(() => client.post('/api/auth/logout'));
  setAccessToken(null);
};

export const getUsernameAutocomplete = async (prefix: string): Promise<string[]> => {
  const response = await client.get<string[]>('/api/autocomplete/username', {
    params: { prefix },
  });
  return response.data;
};

// POST /api/oauth/google/login
// 기존 사용자: { needsSignup: false, accessToken, role }
// 신규 사용자: { needsSignup: true, socialId, email, name }
export const googleOAuthLogin = async (code: string): Promise<GoogleLoginResponse> => {
  const result = await handleApiReqeust<GoogleLoginResponse>(() =>
    client.post('/api/oauth/google/login', { code }),
  );
  if (!result.needsSignup && result.accessToken) {
    setAccessToken(result.accessToken);
  }
  return result;
};
