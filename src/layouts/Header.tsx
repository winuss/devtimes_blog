'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, Suspense } from 'react';

import ScrollProgressBar from '@/components/common/ScrollProgressBar';
import { Button } from '@/components/ui/button';
import { useSpyElem } from '@/hook/useSpy';
import ThemeSwitch from '@/layouts/theme/Switch';
import { cn } from '@/lib/utils';
import { Github, Search, X } from 'lucide-react';

const navList = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
];

const mainHome = {
  name: 'DEVTIMES',
  href: 'https://devtimes.com'
}

// 검색 컴포넌트 내부
const HeaderSearchInner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 현재 검색어 가져오기
  useEffect(() => {
    const currentQuery = searchParams.get('q') || '';
    setQuery(currentQuery);
  }, [searchParams]);

  // 검색 실행
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set('q', query.trim());
      router.push(`/?${params.toString()}`);
    } else {
      router.push('/');
    }
    setIsOpen(false);
  };

  // 검색창 열기/닫기
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Escape 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      // Cmd/Ctrl + K로 검색창 열기
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* 검색 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSearch}
        className={cn(
          "hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground",
          "border rounded-md hover:bg-muted/50 transition-colors",
          "min-w-[280px] justify-between"
        )}
      >
        <div className="flex items-center gap-2">
          <Search className="size-4" />
          <span>검색...</span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* 모바일 검색 버튼 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSearch}
        className="sm:hidden"
      >
        <Search className="size-4" />
      </Button>

      {/* 검색 오버레이 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="flex min-h-screen items-start justify-center p-4 pt-16">
            <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center rounded-xl border border-border bg-card shadow-lg shadow-black/10 dark:shadow-black/40">
                  <Search className="ml-3 size-4 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="블로그에서 검색..."
                    className="flex-1 rounded-xl bg-transparent px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="mr-1"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </form>
              <div className="mt-2 text-center text-xs text-muted-foreground">
                Enter를 눌러 검색 • Esc로 닫기
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 검색 컴포넌트 (Suspense 감싸진)
const HeaderSearch = () => {
  return (
    <Suspense fallback={
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground",
          "border rounded-md min-w-[280px] justify-between opacity-50"
        )}
        disabled
      >
        <div className="flex items-center gap-2">
          <Search className="size-4" />
          <span>로딩중...</span>
        </div>
      </Button>
    }>
      <HeaderSearchInner />
    </Suspense>
  );
};

export const Header = () => {
  const pathname = usePathname();
  const isMainList = pathname === '/';
  const { ref, marginTop } = useSpyElem(65);

  return (
    <nav
      style={{ marginTop: isMainList ? marginTop : 0 }}
      ref={ref}
      className={cn(
        'z-40 flex w-full flex-col items-center justify-center border-b border-border/80 print:hidden',
        'bg-background/80 shadow-sm shadow-black/[0.03] backdrop-blur-md supports-[backdrop-filter]:bg-background/70',
        'dark:shadow-black/20',
        isMainList ? 'fixed' : 'static',
      )}
    >
      <div className='flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6'>
        <div className='flex flex-wrap items-center gap-1 sm:gap-1.5'>
            <Link
              href={mainHome.href}
              key={mainHome.name}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'rounded-full px-3 py-1.5 text-center text-xs font-semibold transition-colors sm:text-sm',
                'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
              )}
            >
              {mainHome.name}
            </Link>
          {navList.map((navItem) => {
            const active =
              navItem.href === '/'
                ? pathname === '/'
                : pathname === navItem.href || pathname.startsWith(`${navItem.href}/`);
            return (
            <Link
              href={navItem.href}
              key={navItem.name}
              className={cn(
                'rounded-full px-3 py-1.5 text-center text-xs transition-colors sm:text-sm',
                active
                  ? 'bg-muted font-medium text-foreground'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              {navItem.name}
            </Link>
            );
          })}
        </div>

        <div className='flex items-center gap-3'>
          <HeaderSearch />
          {/* <ThemeSwitch /> */}
          <Button asChild variant='ghost' size='icon'>
            <Link href='https://github.com/winuss' target='_blank'>
              <Github className='size-[1.2rem]' />
            </Link>
          </Button>
        </div>
      </div>
      <ScrollProgressBar />
    </nav>
  );
};
