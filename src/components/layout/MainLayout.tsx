// ============================================
// FATI - Layout Principal
// ============================================

import { useEffect, useState } from 'react';
import { useUIStore } from '@/store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  space?: 'institution' | 'sector' | 'admin' | 'contributor' | 'annonceur';
  title?: string;
}

export const MainLayout = ({ children, space = 'institution', title }: MainLayoutProps) => {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const sidebarMobileOpen = useUIStore((state) => state.sidebarMobileOpen);
  const theme = useUIStore((state) => state.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Appliquer le thème
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 hidden h-screen transition-all duration-300 ease-spring lg:block',
          sidebarCollapsed ? 'w-20' : 'w-72'
        )}
      >
        <Sidebar space={space} collapsed={sidebarCollapsed} />
      </aside>

      {/* Sidebar Mobile */}
      {sidebarMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => useUIStore.getState().setSidebarMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-screen w-72 lg:hidden">
            <Sidebar space={space} collapsed={false} isMobile />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300 ease-spring',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        )}
      >
        <Header space={space} />
        <main className="flex-1 p-4 pt-20 lg:p-6 lg:pt-24">
          <div className="animate-fade-in">
            {title && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
