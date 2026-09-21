import { apiClient } from './client';

export interface ErrorLog {
  id: number;
  service_name: string;
  exception_type: string;
  message: string;
  stack_trace: string;
  ai_analysis: string | null;
  status: 'UNSOLVED' | 'IN_PROGRESS' | 'RESOLVED';
  created_at: string;
}

// 1. 에러 목록 조회
export const getErrorsApi = async (): Promise<ErrorLog[]> => {
  const response = await apiClient.get<ErrorLog[]>('/errors');
  return response.data;
};

// 2. 에러 상세 조회
export const getErrorDetailApi = async (id: number): Promise<ErrorLog> => {
  const response = await apiClient.get<ErrorLog>(`/errors/${id}`);
  return response.data;
};