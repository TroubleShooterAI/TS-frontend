import { apiClient } from './client';
import type { LoginResponse, SignupResponse } from '../types/auth.ts';

// 회원 가입 API
export const signupApi = async (email: string, password: string): Promise<SignupResponse> => {
    const response = await apiClient.post<SignupResponse>(
        '/auth/signup?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}'
    );
    return response.data;
};

// 로그인 API
export const loginApi = async (email: string, password: string): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', email); // FastAPI OAuth2Form은 username 필드 사용
  formData.append('password', password);

  const response = await apiClient.post<LoginResponse>('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};
