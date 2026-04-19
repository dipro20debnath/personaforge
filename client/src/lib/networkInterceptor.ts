/**
 * 🌐 Network Interceptor
 * Intercepts all fetch calls to log network requests/responses
 * and measure performance
 */

import { DebugLogger } from './debugLogger';

export interface NetworkMetrics {
  method: string;
  endpoint: string;
  status: number;
  duration: number;
  requestSize: number;
  responseSize: number;
  timestamp: Date;
  error?: string;
}

class NetworkInterceptor {
  private originalFetch = window.fetch;
  private metrics: NetworkMetrics[] = [];
  private maxMetrics = 500;
  private isEnabled = process.env.NODE_ENV === 'development';

  /**
   * Initialize network interception
   */
  init() {
    if (!this.isEnabled) return;

    window.fetch = this.interceptedFetch.bind(this);
    DebugLogger.info('🌐 Network Interceptor initialized');
  }

  /**
   * Intercepted fetch implementation
   */
  private async interceptedFetch(
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> {
    const startTime = performance.now();
    const url = typeof input === 'string' ? input : input.toString();
    const method = init?.method || 'GET';

    // Extract endpoint for logging
    const endpoint = this.extractEndpoint(url);

    // Log request
    const requestBody = init?.body ? JSON.parse(String(init.body)) : undefined;
    const requestSize = init?.body ? String(init.body).length : 0;

    DebugLogger.network(method, endpoint, requestBody);

    try {
      // Make actual fetch
      const response = await this.originalFetch.apply(window, [input, init]);
      const duration = performance.now() - startTime;

      // Clone response to read body
      const responseClone = response.clone();
      const responseBody = await responseClone.text();
      const responseSize = responseBody.length;

      // Parse response if JSON
      let parsedResponse: any;
      try {
        parsedResponse = JSON.parse(responseBody);
      } catch {
        parsedResponse = responseBody;
      }

      // Log response
      DebugLogger.networkResponse(method, endpoint, response.status, duration, {
        status: response.status,
        statusText: response.statusText,
        responseSize: `${(responseSize / 1024).toFixed(2)} KB`,
        data: parsedResponse,
      });

      // Store metrics
      this.recordMetric({
        method,
        endpoint,
        status: response.status,
        duration,
        requestSize,
        responseSize,
        timestamp: new Date(),
      });

      return response;
    } catch (error) {
      const duration = performance.now() - startTime;

      DebugLogger.error(`${method} ${endpoint} failed`, {
        error: (error as Error).message,
        duration: `${duration.toFixed(2)}ms`,
      });

      this.recordMetric({
        method,
        endpoint,
        status: 0,
        duration,
        requestSize,
        responseSize: 0,
        timestamp: new Date(),
        error: (error as Error).message,
      });

      throw error;
    }
  }

  /**
   * Extract clean endpoint from full URL
   */
  private extractEndpoint(url: string): string {
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.pathname + urlObj.search;
    } catch {
      return url;
    }
  }

  /**
   * Record network metric
   */
  private recordMetric(metric: NetworkMetrics) {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }
  }

  /**
   * Get all network metrics
   */
  getMetrics(filter?: { method?: string; endpoint?: string }): NetworkMetrics[] {
    if (!filter) return this.metrics;

    return this.metrics.filter((metric) => {
      if (filter.method && metric.method !== filter.method) return false;
      if (filter.endpoint && !metric.endpoint.includes(filter.endpoint))
        return false;
      return true;
    });
  }

  /**
   * Get network summary statistics
   */
  getSummary() {
    const successful = this.metrics.filter((m) => m.status >= 200 && m.status < 300);
    const failed = this.metrics.filter((m) => m.status >= 400 || m.status === 0);
    const avgDuration =
      this.metrics.reduce((sum, m) => sum + m.duration, 0) / this.metrics.length;
    const totalDataTransferred = this.metrics.reduce(
      (sum, m) => sum + m.requestSize + m.responseSize,
      0
    );

    return {
      totalRequests: this.metrics.length,
      successful: successful.length,
      failed: failed.length,
      successRate: `${((successful.length / this.metrics.length) * 100).toFixed(1)}%`,
      averageDuration: `${avgDuration.toFixed(2)}ms`,
      totalDataTransferred: `${(totalDataTransferred / 1024 / 1024).toFixed(2)} MB`,
      slowestRequest: this.metrics.reduce(
        (prev, current) => (prev.duration > current.duration ? prev : current),
        this.metrics[0]
      ),
      fastestRequest: this.metrics.reduce(
        (prev, current) => (prev.duration < current.duration ? prev : current),
        this.metrics[0]
      ),
    };
  }

  /**
   * Print network metrics table
   */
  printMetrics(filter?: { method?: string; endpoint?: string }) {
    const metricsToShow = this.getMetrics(filter);
    console.table(
      metricsToShow.map((m) => ({
        Time: m.timestamp.toLocaleTimeString(),
        Method: m.method,
        Endpoint: m.endpoint,
        Status: m.status,
        Duration: `${m.duration.toFixed(2)}ms`,
        'Request Size': `${(m.requestSize / 1024).toFixed(2)} KB`,
        'Response Size': `${(m.responseSize / 1024).toFixed(2)} KB`,
        Error: m.error || '-',
      }))
    );
  }

  /**
   * Print summary
   */
  printSummary() {
    console.log('📊 Network Summary:', this.getSummary());
  }

  /**
   * Clear metrics
   */
  clear() {
    this.metrics = [];
  }

  /**
   * Export metrics as JSON
   */
  export(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Disable interception
   */
  disable() {
    window.fetch = this.originalFetch;
    DebugLogger.info('🌐 Network Interceptor disabled');
  }
}

// Create singleton instance
export const networkInterceptor = new NetworkInterceptor();

// Auto-init in development
if (typeof window !== 'undefined') {
  if (process.env.NODE_ENV === 'development') {
    networkInterceptor.init();
  }

  // Global access
  (window as any).__networkInterceptor = networkInterceptor;
  console.log('🌐 Network Interceptor available as: window.__networkInterceptor');
}
