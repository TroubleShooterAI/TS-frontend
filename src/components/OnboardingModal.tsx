import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, Server } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [activeTab, setActiveTab] = useState<'python' | 'node' | 'json'>('python');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeExamples = {
    python: `# Python / FastAPI 연동 예시
import requests
import traceback

def send_error_to_dashboard(service_name: str, exc: Exception):
    url = "http://localhost:8000/api/v1/logs" # 백엔드 수집 URL
    payload = {
        "service_name": service_name,
        "exception_type": type(exc).__name__,
        "message": str(exc),
        "stack_trace": traceback.format_exc()
    }
    try:
        requests.post(url, json=payload, timeout=2)
    except Exception as e:
        print("로그 전송 실패:", e)

# 사용 예시
try:
    1 / 0
except Exception as e:
    send_error_to_dashboard("Payment-Service", e)`,

    node: `// Node.js / Express 연동 예시
const axios = require('axios');

async function sendErrorToDashboard(serviceName, error) {
  try {
    await axios.post('http://localhost:8000/api/v1/logs', {
      service_name: serviceName,
      exception_type: error.name || 'Error',
      message: error.message,
      stack_trace: error.stack
    }, { timeout: 2000 });
  } catch (err) {
    console.error('로그 전송 실패:', err.message);
  }
}

// Express 에러 핸들러 미들웨어
app.use((err, req, res, next) => {
  sendErrorToDashboard('User-API', err);
  res.status(500).send('Internal Server Error');
});`,

    json: `// HTTP POST /api/v1/logs 페이로드 규격
{
  "service_name": "My-Backend-Service", // 서비스 구분 이름
  "exception_type": "DatabaseConnectionError", // 에러 종류
  "message": "Connection timed out after 5000ms", // 에러 메시지
  "stack_trace": "Traceback (most recent call last):\n  File 'app.py'..." // 스택 트레이스
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-400" />
              새 서비스 연동 가이드
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              운영 중인 백엔드 서비스에서 발생한 예외를 TroubleShooter AI로 전송하세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 gap-4">
            <button
              onClick={() => setActiveTab('python')}
              className={`pb-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'python'
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" /> Python / FastAPI
            </button>
            <button
              onClick={() => setActiveTab('node')}
              className={`pb-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'node'
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" /> Node.js / Express
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`pb-2 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'json'
                  ? 'border-b-2 border-blue-500 text-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              JSON Spec
            </button>
          </div>

          {/* Code Box */}
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨' : '코드 복사'}</span>
            </button>
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {codeExamples[activeTab]}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
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