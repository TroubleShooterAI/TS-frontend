import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi, signupApi } from '../api/auth';
import { ShieldAlert, Terminal, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // 로그인 처리
        const res = await loginApi(email, password);
        localStorage.setItem('token', res.access_token);
        navigate('/'); // 메인 대시보드로 이동
      } else {
        // 회원가입 처리
        await signupApi(email, password);
        alert('회원가입이 완료되었습니다. 로그인해 주세요.');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.detail;
      setErrorMsg(typeof detail === 'string' ? detail : '요청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Background Glow Filter */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative z-10 max-w-md">
        {/* Header Icon & Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-4 text-blue-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-400" />
            TroubleShooter AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isLogin ? '로그인하여 모니터링 대시보드에 접속하세요' : '새로운 관리자 계정을 생성합니다'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">이메일 계정</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@troubleshooter.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">비밀번호</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 text-sm mt-6 disabled:opacity-50"
          >
            {isLoading ? (
              <span>처리 중...</span>
            ) : (
              <>
                <span>{isLogin ? '대시보드 접속' : '계정 생성'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg('');
            }}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline underline-offset-4"
          >
            {isLogin ? '계정이 없으신가요? 회원가입하기' : '이미 계정이 있으신가요? 로그인하기'}
          </button>
        </div>
      </div>
    </div>
  );
}