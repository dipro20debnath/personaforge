/**
 * 🔍 Debug Logger - Monitor network, state, and performance
 * Logs to console with timestamps, colors, and filtering options
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  NETWORK = '🌐 NETWORK',
  STATE = '📊 STATE',
  RENDER = '🎨 RENDER',
  PERFORMANCE = '⚡ PERFORMANCE',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  duration?: number;
}

export class DebugLogger {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  private static logs: LogEntry[] = [];
  private static maxLogs = 500;

  // Color coding for console
  private static colors = {
    [LogLevel.DEBUG]: 'color: #888;',
    [LogLevel.INFO]: 'color: #0066cc;',
    [LogLevel.WARN]: 'color: #ff9900;',
    [LogLevel.ERROR]: 'color: #ff0000; font-weight: bold;',
    [LogLevel.NETWORK]: 'color: #00aa00; font-weight: bold;',
    [LogLevel.STATE]: 'color: #9900ff; font-weight: bold;',
    [LogLevel.RENDER]: 'color: #ff6600; font-weight: bold;',
    [LogLevel.PERFORMANCE]: 'color: #ff0099; font-weight: bold;',
  };

  /**
   * Log a message with optional data
   */
  static log(level: LogLevel, message: string, data?: any, duration?: number) {
    if (!this.isDevelopment) return;

    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });

    const entry: LogEntry = { timestamp, level, message, data, duration };
    this.logs.push(entry);

    // Keep logs array from getting too large
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    const style = this.colors[level] || '';
    const durationStr = duration ? ` (${duration.toFixed(2)}ms)` : '';
    console.log(
      `%c[${timestamp}] ${level} ${message}${durationStr}`,
      style
    );

    if (data) {
      console.log('Data:', data);
    }
  }

  // Convenience methods
  static debug(msg: string, data?: any) {
    this.log(LogLevel.DEBUG, msg, data);
  }

  static info(msg: string, data?: any) {
    this.log(LogLevel.INFO, msg, data);
  }

  static warn(msg: string, data?: any) {
    this.log(LogLevel.WARN, msg, data);
  }

  static error(msg: string, data?: any) {
    this.log(LogLevel.ERROR, msg, data);
  }

  /**
   * Log network request
   */
  static network(method: string, endpoint: string, data?: any) {
    this.log(LogLevel.NETWORK, `${method} ${endpoint}`, data);
  }

  /**
   * Log network response
   */
  static networkResponse(
    method: string,
    endpoint: string,
    status: number,
    duration: number,
    data?: any
  ) {
    const statusEmoji = status >= 200 && status < 300 ? '✅' : '❌';
    this.log(
      LogLevel.NETWORK,
      `${statusEmoji} ${method} ${endpoint} (${status})`,
      data,
      duration
    );
  }

  /**
   * Log state update
   */
  static stateUpdate(componentName: string, stateName: string, newValue: any, oldValue?: any) {
    this.log(LogLevel.STATE, `${componentName} → ${stateName} updated`, {
      old: oldValue,
      new: newValue,
    });
  }

  /**
   * Log component render
   */
  static render(componentName: string, reason?: string) {
    this.log(LogLevel.RENDER, `${componentName} rendered${reason ? ` (${reason})` : ''}`);
  }

  /**
   * Log performance measurement
   */
  static performance(operation: string, duration: number, details?: any) {
    const speedIndicator = duration < 100 ? '🚀' : duration < 500 ? '⚡' : '🐢';
    this.log(LogLevel.PERFORMANCE, `${speedIndicator} ${operation}`, details, duration);
  }

  /**
   * Get all logs
   */
  static getLogs(filter?: LogLevel): LogEntry[] {
    if (filter) {
      return this.logs.filter((log) => log.level === filter);
    }
    return this.logs;
  }

  /**
   * Get logs as formatted table for console
   */
  static printLogs(filter?: LogLevel) {
    const logsToShow = this.getLogs(filter);
    console.table(logsToShow.map((log) => ({
      Time: log.timestamp,
      Level: log.level,
      Message: log.message,
      Duration: log.duration ? `${log.duration.toFixed(2)}ms` : '-',
      Data: JSON.stringify(log.data),
    })));
  }

  /**
   * Clear all logs
   */
  static clear() {
    this.logs = [];
    console.clear();
  }

  /**
   * Export logs as JSON
   */
  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get performance summary
   */
  static getPerformanceSummary() {
    const networkLogs = this.logs.filter((log) => log.level === LogLevel.NETWORK);
    const performanceLogs = this.logs.filter((log) => log.level === LogLevel.PERFORMANCE);

    const avgDuration =
      performanceLogs.reduce((sum, log) => sum + (log.duration || 0), 0) /
      performanceLogs.length;

    return {
      totalRequests: networkLogs.length,
      totalOperations: performanceLogs.length,
      averageDuration: isNaN(avgDuration) ? 0 : avgDuration,
      slowestOperation: performanceLogs.reduce((prev, current) =>
        (prev.duration || 0) > (current.duration || 0) ? prev : current
      ),
    };
  }
}

// Global access in browser console
if (typeof window !== 'undefined') {
  (window as any).__debugLogger = DebugLogger;
  console.log('🔍 DebugLogger available as: window.__debugLogger');
}
