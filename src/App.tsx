import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

// 간단 테스트용 임시 대시보드 컴포넌트
const DummyDashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">🎉 로그인 성공!</h1>
        <p className="text-slate-400 text-sm mb-6">TroubleShooter 대시보드에 접근하였습니다.</p>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-medium text-white transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

// 로그인 여부 검증 Guard (토큰 없으면 /login 으로 이동)
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DummyDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}