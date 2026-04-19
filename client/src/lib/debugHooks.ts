/**
 * 🎯 Custom Debugging Hooks
 * Monitor component renders, state updates, performance, and effects
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { DebugLogger, LogLevel } from './debugLogger';

/**
 * Hook to log component renders and re-render reasons
 * Usage: useDebugRender('MyComponent')
 */
export function useDebugRender(componentName: string) {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current++;
    DebugLogger.render(componentName, `render #${renderCount.current}`);
  });

  return { renderCount: renderCount.current };
}

/**
 * Hook to track state updates with before/after values
 * Usage: const [count, setCount] = useDebugState(0, 'count', 'MyComponent')
 */
export function useDebugState<T>(
  initialValue: T,
  stateName: string,
  componentName: string
): [T, (value: T | ((val: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  const prevValueRef = useRef<T>(initialValue);

  const setDebugState = useCallback((value: T | ((val: T) => T)) => {
    setState((prevState) => {
      const newState = typeof value === 'function' ? (value as Function)(prevState) : value;
      DebugLogger.stateUpdate(componentName, stateName, newState, prevState);
      prevValueRef.current = newState;
      return newState;
    });
  }, [componentName, stateName]);

  return [state, setDebugState];
}

/**
 * Hook to measure performance of async operations
 * Usage: const { data, loading, error } = useDebugAsync(fetchData, [])
 */
export function useDebugAsync<T>(
  asyncFn: () => Promise<T>,
  dependencies: any[],
  operationName: string = 'async operation'
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const execute = async () => {
      try {
        setLoading(true);
        startTimeRef.current = performance.now();
        
        DebugLogger.debug(`Starting: ${operationName}`);
        const result = await asyncFn();
        
        const duration = performance.now() - startTimeRef.current;
        setData(result);
        setError(null);
        
        DebugLogger.performance(operationName, duration, { resultType: typeof result });
      } catch (err) {
        const duration = performance.now() - startTimeRef.current;
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        DebugLogger.performance(operationName, duration, { error: error.message });
        DebugLogger.error(`Failed: ${operationName}`, error);
      } finally {
        setLoading(false);
      }
    };

    execute();
  }, dependencies);

  return { data, loading, error };
}

/**
 * Hook to track effect execution
 * Usage: useDebugEffect(() => { ... }, [], 'MyEffect')
 */
export function useDebugEffect(
  effect: React.EffectCallback,
  deps: React.DependencyList,
  effectName: string = 'effect'
) {
  useEffect(() => {
    DebugLogger.debug(`Effect started: ${effectName}`);
    const startTime = performance.now();

    const cleanup = effect();

    return () => {
      const duration = performance.now() - startTime;
      DebugLogger.performance(`${effectName} cleanup`, duration);
      if (cleanup) cleanup();
    };
  }, deps);
}

/**
 * Hook to measure function execution time
 * Usage: const timedFn = useDebugTiming(myFunction, 'myFunction')
 */
export function useDebugTiming<T extends (...args: any[]) => any>(
  fn: T,
  fnName: string = fn.name || 'function'
): T {
  return useCallback(
    ((...args: any[]) => {
      const startTime = performance.now();
      try {
        const result = fn(...args);
        
        if (result instanceof Promise) {
          return result
            .then((resolvedValue) => {
              const duration = performance.now() - startTime;
              DebugLogger.performance(`${fnName} (async)`, duration);
              return resolvedValue;
            })
            .catch((err) => {
              const duration = performance.now() - startTime;
              DebugLogger.performance(`${fnName} (async failed)`, duration);
              throw err;
            });
        } else {
          const duration = performance.now() - startTime;
          DebugLogger.performance(fnName, duration);
          return result;
        }
      } catch (error) {
        const duration = performance.now() - startTime;
        DebugLogger.error(`${fnName} threw error`, error);
        DebugLogger.performance(fnName, duration);
        throw error;
      }
    }) as T,
    [fn, fnName]
  );
}

/**
 * Hook to monitor prop changes
 * Usage: useDebugProps({ title, count, data }, 'MyComponent')
 */
export function useDebugProps(props: Record<string, any>, componentName: string) {
  const prevPropsRef = useRef<Record<string, any>>(props);

  useEffect(() => {
    const changedProps: Record<string, any> = {};
    
    Object.keys(props).forEach((key) => {
      if (prevPropsRef.current[key] !== props[key]) {
        changedProps[key] = {
          old: prevPropsRef.current[key],
          new: props[key],
        };
      }
    });

    if (Object.keys(changedProps).length > 0) {
      DebugLogger.log(LogLevel.STATE, `${componentName} props changed`, changedProps);
    }

    prevPropsRef.current = props;
  }, [props, componentName]);
}

/**
 * Hook to track memory usage (for React Profiler)
 * Usage: useMemoryMonitor()
 */
export function useMemoryMonitor() {
  useEffect(() => {
    if (!(performance as any).memory) {
      DebugLogger.warn('Memory monitoring not available in this browser');
      return;
    }

    const checkMemory = () => {
      const memory = (performance as any).memory;
      DebugLogger.log(LogLevel.DEBUG, 'Memory Usage', {
        usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
      });
    };

    const interval = setInterval(checkMemory, 5000);
    return () => clearInterval(interval);
  }, []);
}

/**
 * Hook to log API calls with timing
 * Usage: const result = await useApiDebug(api.getGoals)()
 */
export function useApiDebug<T extends (...args: any[]) => Promise<any>>(
  apiCall: T,
  apiName: string = apiCall.name || 'API call'
): T {
  return useCallback(
    (async (...args: any[]) => {
      const startTime = performance.now();
      
      DebugLogger.network('REQUEST', apiName);

      try {
        const result = await apiCall(...args);
        const duration = performance.now() - startTime;
        
        DebugLogger.networkResponse('RESPONSE', apiName, 200, duration, {
          dataSize: JSON.stringify(result).length,
        });

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        const statusCode = (error as any)?.status || 500;
        
        DebugLogger.networkResponse('ERROR', apiName, statusCode, duration, {
          error: (error as Error).message,
        });

        throw error;
      }
    }) as T,
    [apiCall, apiName]
  );
}
