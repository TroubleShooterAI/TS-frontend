import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorsApi } from '../api/errors';
import type { ErrorLog } from '../api/errors';
import { 
  ShieldAlert, LogOut, RefreshCw, AlertCircle, 
  CheckCircle2, Clock, Sparkles, Terminal, ChevronRight 
} from 'lucide-react';

export default function DashboardPage() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // 에러 목록 로드
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getErrorsApi();
      setLogs(data);
      if (data.length > 0 && !selectedLog) {
        setSelectedLog(data[0]); // 첫 번째 항목 기본 선택
      }
    } catch (err) {
      console.error('로그 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 상태 통계 계산
  const totalCount = logs.length;
  const unsolvedCount = logs.filter((l) => l.status === 'UNSOLVED').length;
  const resolvedCount = logs.filter((l) => l.status === 'RESOLVED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            TroubleShooter AI
            <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30 font-mono">v1.0</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-sm transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">전체 발생 로그</p>
              <p className="text-2xl font-bold mt-1 text-slate-100">{totalCount}</p>
            </div>
            <div className="p-3 bg-slate-800 rounded-xl text-slate-400">
              <Terminal className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">미해결 오류</p>
              <p className="text-2xl font-bold mt-1 text-rose-400">{unsolvedCount}</p>
            </div>
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">해결 완료</p>
              <p className="text-2xl font-bold mt-1 text-emerald-400">{resolvedCount}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Two Column Section: Log List & Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
          {/* Left Column: Log List */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col overflow-hidden">
            <h2 className="text-sm font-semibold text-slate-300 mb-3 px-2 flex items-center justify-between">
              <span>수집된 에러 리스트</span>
              <span className="text-xs text-slate-500 font-normal">{logs.length}개 항목</span>
            </h2>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                  수집된 에러 로그가 없습니다.
                </div>
              ) : (
                logs.map((log) => {
                  const isSelected = selectedLog?.id === log.id;
                  return (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500/50 shadow-md'
                          : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                          {log.service_name}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium text-slate-200 truncate">{log.exception_type}</h3>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{log.message}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: AI Analysis Detail Panel */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col overflow-y-auto">
            {selectedLog ? (
              <div className="space-y-6">
                {/* Exception Summary Header */}
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                      {selectedLog.exception_type}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{selectedLog.service_name}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-100">{selectedLog.message}</h2>
                </div>

                {/* Stack Trace Box */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    Stack Trace
                  </h3>
                  <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {selectedLog.stack_trace || '스택 트레이스 정보가 없습니다.'}
                  </pre>
                </div>

                {/* Gemini AI Analysis Box */}
                <div className="bg-gradient-to-b from-blue-950/20 to-slate-950 border border-blue-500/30 rounded-xl p-5 relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3 text-blue-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <h3 className="text-sm font-semibold">Gemini AI 원인 분석 & 해결 가이드</h3>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed space-y-2 whitespace-pre-wrap">
                    {selectedLog.ai_analysis || 'AI가 에러 로그를 분석 중이거나 결과가 없습니다.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2">
                <ChevronRight className="w-8 h-8 text-slate-600" />
                <p className="text-sm">왼쪽 리스트에서 상세 분석할 에러 로그를 선택하세요.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}