import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, Server, Download } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [activeTab, setActiveTab] = useState<'sdk' | 'python' | 'json'>('sdk');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeExamples = {
    sdk: `# troubleshooter.py (프로젝트 루트에 이 파일명으로 저장하세요)
import sys
import threading
import requests
import traceback

class TroubleShooter:
    def __init__(self, service_name: str, server_url: str = "http://localhost:8000"):
        self.service_name = service_name
        self.server_url = f"{server_url.rstrip('/')}/api/v1/logs"
        self._install_global_handler()

    def _send_log_async(self, exc_type, exc_value, exc_traceback):
        formatted_trace = "".join(traceback.format_exception(exc_type, exc_value, exc_traceback))
        payload = {
            "service_name": self.service_name,
            "exception_type": exc_type.__name__ if hasattr(exc_type, '__name__') else str(exc_type),
            "message": str(exc_value),
            "stack_trace": formatted_trace
        }

        def _worker():
            try:
                requests.post(self.server_url, json=payload, timeout=3)
            except Exception as e:
                print(f"[TroubleShooter SDK] 로그 전송 실패: {e}")

        threading.Thread(target=_worker, daemon=True).start()

    def _install_global_handler(self):
        original_excepthook = sys.excepthook

        def custom_excepthook(exc_type, exc_value, exc_traceback):
            if issubclass(exc_type, KeyboardInterrupt):
                sys.__excepthook__(exc_type, exc_value, exc_traceback)
                return
            self._send_log_async(exc_type, exc_value, exc_traceback)
            original_excepthook(exc_type, exc_value, exc_traceback)

        sys.excepthook = custom_excepthook

    def capture_exception(self, exc: Exception):
        self._send_log_async(type(exc), exc, exc.__traceback__)

    def init_fastapi(self, app):
        from starlette.requests import Request
        from starlette.responses import JSONResponse

        @app.exception_handler(Exception)
        async def fastapi_global_exception_handler(request: Request, exc: Exception):
            self.capture_exception(exc)
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal Server Error (Captured by TroubleShooter)"}
            )`,

    python: `# main.py (기존 서비스 실행 스크립트)
from troubleshooter import TroubleShooter

# 1. 일반 Python 앱 연동 시 (단 1줄만 추가)
ts = TroubleShooter(service_name="Payment-Service")

# 2. FastAPI 프레임워크 연동 시
from fastapi import FastAPI
app = FastAPI()

ts = TroubleShooter(service_name="Payment-API")
ts.init_fastapi(app) # FastAPI 전역 에러 바인딩

# 설정 끝! 이후 발생하는 모든 unhandled error는 대시보드로 자동 전송됩니다.`,

    json: `// HTTP POST /api/v1/logs 페이로드 데이터 규격
{
  "service_name": "Payment-Service",
  "exception_type": "ZeroDivisionError",
  "message": "division by zero",
  "stack_trace": "Traceback (most recent call last):\n  File 'app.py', line 10..."
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              TroubleShooter SDK 연동 가이드
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              `troubleshooter.py` 파일 하나만 추가하면 서비스의 에러가 자동으로 대시보드에 집계됩니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
            <button
              onClick={() => setActiveTab('sdk')}
              className={`pb-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'sdk'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4" /> 1. SDK 코드 (troubleshooter.py)
            </button>
            <button
              onClick={() => setActiveTab('python')}
              className={`pb-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'python'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" /> 2. 서비스 적용 예시 (Python)
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`pb-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'json'
                  ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" /> API JSON Spec
            </button>
          </div>

          {/* Code Box */}
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1 transition-colors border border-slate-700 cursor-pointer z-10"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨' : '코드 복사'}</span>
            </button>
            <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[400px]">
              {codeExamples[activeTab]}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-xs transition-colors cursor-pointer"
          >
            확인 및 연동 시작
          </button>
        </div>
      </div>
    </div>
  );
}