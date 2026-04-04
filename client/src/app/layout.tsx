import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export const metadata: Metadata = { title: 'PersonaForge — Shape Your Future', description: 'The ultimate personality management platform' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeInit />
        <AnimatedBackground variant="full" interactive={false} />
        <div className="relative z-10">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}

function ThemeInit() {
  return (
    <script dangerouslySetInnerHTML={{ __html: `
      (function(){try{var t=localStorage.getItem('pf_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();
    ` }} />
  );
}
