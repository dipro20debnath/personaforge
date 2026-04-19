'use client';

/**
 * 🔍 Debug Panel Component
 * Displays real-time debugging information overlay
 */

import { useState, useEffect } from 'react';
import { DebugLogger, LogLevel } from '@/lib/debugLogger';
import { networkInterceptor } from '@/lib/networkInterceptor';
import { ChevronDown, Download, Trash2, Eye, EyeOff } from 'lucide-react';

type TabType = 'logs' | 'network' | 'performance' | 'state';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('logs');
  const [logs, setLogs] = useState<any[]>([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Auto-refresh logs
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCounter((c) => c + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLogs(DebugLogger.getLogs());
  }, [refreshCounter]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const logs_list = DebugLogger.getLogs();
  const networkMetrics = networkInterceptor.getMetrics();
  const perfSummary = DebugLogger.getPerformanceSummary();
  const networkSummary = networkInterceptor.getSummary();

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-4 py-2 rounded-lg font-bold flex items-center gap-2
          transition-all duration-200 shadow-lg
          ${
            isOpen
              ? 'bg-gray-900 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        🔍 Debug
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-[600px] max-h-[500px] bg-gray-950 text-gray-100 rounded-lg shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-700 p-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  activeTab === 'logs'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📋 Logs ({logs_list.length})
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  activeTab === 'network'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🌐 Network ({networkMetrics.length})
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  activeTab === 'performance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ⚡ Performance
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const data =
                    activeTab === 'network'
                      ? networkInterceptor.export()
                      : DebugLogger.exportLogs();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `debug-${activeTab}-${Date.now()}.json`;
                  a.click();
                }}
                className="text-gray-400 hover:text-white transition"
                title="Export"
              >
                <Download size={16} />
              </button>

              <button
                onClick={() => {
                  if (activeTab === 'network') {
                    networkInterceptor.clear();
                  } else {
                    DebugLogger.clear();
                  }
                  setRefreshCounter((c) => c + 1);
                }}
                className="text-gray-400 hover:text-white transition"
                title="Clear"
              >
                <Trash2 size={16} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-gray-950 p-3 space-y-2">
            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <div className="space-y-1">
                {logs_list.length === 0 ? (
                  <div className="text-gray-500">No logs yet</div>
                ) : (
                  logs_list.slice(-20).map((log, i) => (
                    <div key={i} className="border-l-2 border-gray-700 pl-2 py-1">
                      <div className="text-gray-400">
                        <span className="text-gray-600">[{log.timestamp}]</span>{' '}
                        <span
                          className={`font-semibold ${
                            log.level === LogLevel.ERROR
                              ? 'text-red-400'
                              : log.level === LogLevel.WARN
                              ? 'text-yellow-400'
                              : 'text-blue-400'
                          }`}
                        >
                          {log.level}
                        </span>{' '}
                        <span className="text-gray-300">{log.message}</span>
                        {log.duration && (
                          <span className="text-green-400">
                            {' '}
                            ({log.duration.toFixed(2)}ms)
                          </span>
                        )}
                      </div>
                      {log.data && (
                        <div className="text-gray-600 text-xs ml-2 bg-gray-900 p-1 rounded mt-1 max-h-16 overflow-y-auto">
                          {JSON.stringify(log.data).substring(0, 200)}...
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Network Tab */}
            {activeTab === 'network' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs mb-3 bg-gray-900 p-2 rounded">
                  <div>Total: {networkSummary.totalRequests}</div>
                  <div className="text-green-400">
                    Success: {networkSummary.successful}
                  </div>
                  <div className="text-red-400">Failed: {networkSummary.failed}</div>
                  <div>Avg: {networkSummary.averageDuration}</div>
                </div>

                {networkMetrics.length === 0 ? (
                  <div className="text-gray-500">No network requests yet</div>
                ) : (
                  networkMetrics.slice(-10).map((m, i) => (
                    <div key={i} className="border-l-2 border-gray-700 pl-2 py-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            m.status >= 200 && m.status < 300
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {m.status}
                        </span>
                        <span className="text-gray-400 font-semibold">{m.method}</span>
                        <span className="text-blue-400 flex-1 truncate">{m.endpoint}</span>
                        <span className="text-green-400">
                          {m.duration.toFixed(0)}ms
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-gray-900 p-2 rounded">
                  <div>Total Ops: {perfSummary.totalOperations}</div>
                  <div>Avg: {perfSummary.averageDuration.toFixed(2)}ms</div>
                </div>

                {perfSummary.slowestOperation && (
                  <div className="bg-gray-900 p-2 rounded">
                    <div className="text-yellow-400 font-semibold">Slowest:</div>
                    <div className="text-gray-400 ml-2">
                      {perfSummary.slowestOperation.message}
                      {perfSummary.slowestOperation.duration && (
                        <span className="text-red-400 ml-2">
                          {perfSummary.slowestOperation.duration.toFixed(2)}ms
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-gray-400 text-xs bg-gray-900 p-2 rounded max-h-64 overflow-y-auto">
                  <div className="font-semibold mb-2">Performance Logs:</div>
                  {DebugLogger.getLogs(LogLevel.PERFORMANCE)
                    .slice(-5)
                    .map((log, i) => (
                      <div key={i} className="mb-1">
                        <span className="text-green-400">{log.message}</span>
                        <span className="text-yellow-400 ml-2">
                          {log.duration?.toFixed(2)}ms
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
