/**
 * ═══════════════════════════════════════════════════════════════
 *  Animated Background Component
 *  Next-Level Dynamic Visuals with Focus Effects
 * ═══════════════════════════════════════════════════════════════
 */

'use client';
import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  variant?: 'full' | 'soft' | 'vibrant' | 'zen';
  interactive?: boolean;
}

export function AnimatedBackground({ 
  variant = 'full',
  interactive = false 
}: AnimatedBackgroundProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check dark mode
    setIsDark(document.documentElement.classList.contains('dark'));
    
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // Determine background gradient based on variant
  const getGradient = () => {
    if (isDark) {
      switch (variant) {
        case 'soft':
          return 'linear-gradient(-45deg, #0f0f23, #1a1a3e, #16213e, #0a2540)';
        case 'vibrant':
          return 'linear-gradient(-45deg, #2d1b69, #1a1a4d, #0d3b66, #533483)';
        case 'zen':
          return 'linear-gradient(-45deg, #1e1e2e, #2d2d4d, #1a3a3a, #2d1a3a)';
        default:
          return 'linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #533483)';
      }
    } else {
      switch (variant) {
        case 'soft':
          return 'linear-gradient(-45deg, #fafbfc, #f0f4ff, #fff0f5, #f5e6ff)';
        case 'vibrant':
          return 'linear-gradient(-45deg, #ff6b9d, #c44569, #f8b195, #c06c84)';
        case 'zen':
          return 'linear-gradient(-45deg, #e8f4f8, #f0e8f8, #e8f8f0, #f8e8f4)';
        default:
          return 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)';
      }
    }
  };

  const orbColors = isDark 
    ? ['bg-blue-600/30', 'bg-purple-600/30', 'bg-cyan-600/30', 'bg-pink-600/30']
    : ['bg-blue-400/20', 'bg-purple-400/20', 'bg-cyan-400/20', 'bg-pink-400/20'];

  return (
    <div 
      className="fixed inset-0 z-0 overflow-hidden"
      style={{
        background: getGradient(),
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 15s ease infinite'
      }}
    >
      {/* Animated Orbs */}
      <div className="absolute -top-24 -left-12 w-80 h-80 rounded-full blur-3xl opacity-40" 
        style={{
          background: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
          animation: 'floatOrb 8s ease-in-out infinite'
        }}>
      </div>

      <div className="absolute top-1/2 -right-20 w-64 h-64 rounded-full blur-3xl opacity-40"
        style={{
          background: isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.2)',
          animation: 'floatOrb 10s ease-in-out infinite 2s'
        }}>
      </div>

      <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-40"
        style={{
          background: isDark ? 'rgba(34, 211, 238, 0.3)' : 'rgba(34, 211, 238, 0.2)',
          animation: 'floatOrbSlow 12s ease-in-out infinite'
        }}>
      </div>

      <div className="absolute top-1/4 right-1/3 w-56 h-56 rounded-full blur-3xl opacity-40"
        style={{
          background: isDark ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)',
          animation: 'floatOrb 9s ease-in-out infinite 1s'
        }}>
      </div>

      {/* Interactive Spotlights */}
      {interactive && (
        <>
          <div 
            className="absolute pointer-events-none w-96 h-96 rounded-full blur-3xl transition-all duration-200"
            style={{
              background: isDark 
                ? 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
              left: `${mousePos.x - 192}px`,
              top: `${mousePos.y - 192}px`,
              opacity: 0.5
            }}
          />
        </>
      )}

      {/* Floating Particles */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-brand-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-brand-300 rounded-full opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1.5s'}}></div>

      {/* Gradient Overlay Mesh */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1440 900">
        <defs>
          <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#3b82f6" : "#ff6b9d"} />
            <stop offset="100%" stopColor={isDark ? "#8b5cf6" : "#c44569"} />
          </linearGradient>
        </defs>
        <path d="M 0 0 Q 360 225 720 0 T 1440 0 L 1440 900 Q 720 675 0 900 Z" 
          fill="url(#meshGradient)" opacity="0.1" />
        <path d="M 0 300 Q 360 525 720 300 T 1440 300" 
          fill="none" stroke="url(#meshGradient)" strokeWidth="2" opacity="0.2" />
      </svg>
    </div>
  );
}

export default AnimatedBackground;
