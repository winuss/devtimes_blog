'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { CATEGORY_DISPLAY_NAMES } from '@/config/const';
import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import dayjs from 'dayjs';
import { ArrowRight, CornerDownLeft, Hash, History, Search, SearchX, X } from 'lucide-react';

type SearchIndexPost = {
  url: string;
  categoryPath: string;
  title: string;
  desc?: string;
  tags?: string[];
  date?: string;
  searchText: string;
};

type Result = { post: SearchIndexPost; score: number };

const MAX_RESULTS = 8;
const RECENT_KEY = 'search-recent';
const MAX_RECENT = 5;

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore (private mode 등)
  }
};

// PostListClient와 같은 로컬스토리지 캐시를 공유
const useSearchIndex = (enabled: boolean) => {
  const [posts, setPosts] = useState<SearchIndexPost[] | null>(null);
  const requested = useRef(false);

  useEffect(() => {
    if (!enabled || requested.current) return;
    requested.current = true;

    const cached = readStorage('search-index-cache');
    if (cached) {
      try {
        setPosts(JSON.parse(cached).posts || []);
      } catch {
        // 손상된 캐시는 무시하고 새로 받아온다
      }
    }

    fetch('/search-index.json', { cache: 'default' })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        setPosts(data.posts || []);
        writeStorage('search-index-cache', JSON.stringify(data));
        writeStorage('search-index-version', data.version || '');
      })
      .catch(() => setPosts((prev) => prev ?? []));
  }, [enabled]);

  return posts;
};

const toTerms = (query: string) => query.toLowerCase().split(/\s+/).filter(Boolean);

const searchPosts = (posts: SearchIndexPost[], terms: string[]): Result[] => {
  const results: Result[] = [];
  for (const post of posts) {
    const title = post.title.toLowerCase();
    const desc = (post.desc || '').toLowerCase();
    const tags = (post.tags || []).map((t) => t.toLowerCase());
    const text = post.searchText.toLowerCase();

    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      let s = 0;
      if (title.includes(term)) s += 10;
      if (tags.some((t) => t.includes(term))) s += 5;
      if (desc.includes(term)) s += 3;
      if (text.includes(term)) s += 1;
      if (!s) {
        matchedAll = false;
        break;
      }
      score += s;
    }
    if (matchedAll) results.push({ post, score });
  }

  return results.sort(
    (a, b) =>
      b.score - a.score ||
      (b.post.date ? dayjs(b.post.date).valueOf() : 0) -
        (a.post.date ? dayjs(a.post.date).valueOf() : 0)
  );
};

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const Highlight = ({ text, terms }: { text: string; terms: string[] }) => {
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  return (
    <>
      {text.split(re).map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className='rounded-sm bg-yellow-200/70 px-0.5 text-inherit dark:bg-yellow-500/30'
          >
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
};

// 첫 매칭 위치 주변을 잘라 본문 미리보기 생성
const makeSnippet = (post: SearchIndexPost, terms: string[]) => {
  const source = post.searchText.startsWith(post.title)
    ? post.searchText.slice(post.title.length).trim()
    : post.searchText;
  const lower = source.toLowerCase();
  const idx = terms.reduce((min, term) => {
    const i = lower.indexOf(term);
    return i >= 0 && (min < 0 || i < min) ? i : min;
  }, -1);
  if (idx < 0) return post.desc || source.slice(0, 100);
  const start = Math.max(0, idx - 30);
  return `${start > 0 ? '…' : ''}${source.slice(start, start + 120).trim()}…`;
};

const categoryName = (dir: string) =>
  CATEGORY_DISPLAY_NAMES[dir] ?? dir.charAt(0).toUpperCase() + dir.slice(1);

const Kbd = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <kbd
    className={cn(
      'inline-flex h-5 min-w-5 select-none items-center justify-center rounded border border-border bg-muted px-1 font-sans text-[11px] font-medium text-muted-foreground',
      className
    )}
  >
    {children}
  </kbd>
);

export const HeaderSearch = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const [isMac, setIsMac] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const posts = useSearchIndex(open);
  const terms = useMemo(() => toTerms(query), [query]);
  const trimmed = query.trim();

  const results = useMemo(
    () => (posts && terms.length ? searchPosts(posts, terms) : []),
    [posts, terms]
  );

  const popularTags = useMemo(() => {
    if (!posts) return [];
    const count = new Map<string, number>();
    posts.forEach((p) => (p.tags || []).forEach((t) => count.set(t, (count.get(t) || 0) + 1)));
    return [...count.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([t]) => t);
  }, [posts]);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  // ⌘K / Ctrl+K, 그리고 '/' 로 열기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      const target = e.target as HTMLElement;
      const typing =
        target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // 열릴 때 현재 검색어와 최근 검색어 불러오기
  useEffect(() => {
    if (!open) return;
    setQuery(new URLSearchParams(window.location.search).get('q') || '');
    try {
      setRecent(JSON.parse(readStorage(RECENT_KEY) || '[]'));
    } catch {
      setRecent([]);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const saveRecent = useCallback((q: string) => {
    setRecent((prev) => {
      const next = [q, ...prev.filter((r) => r !== q)].slice(0, MAX_RECENT);
      writeStorage(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeRecent = (q: string) => {
    setRecent((prev) => {
      const next = prev.filter((r) => r !== q);
      writeStorage(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  };

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const openPost = (post: SearchIndexPost) => {
    if (trimmed) saveRecent(trimmed);
    go(post.url);
  };

  const viewAll = () => {
    if (!trimmed) return;
    saveRecent(trimmed);
    go(`/?${new URLSearchParams({ q: trimmed })}`);
  };

  const visible = results.slice(0, MAX_RESULTS);
  // 결과 목록 + 마지막 "전체 결과 보기"
  const optionCount = trimmed && results.length ? visible.length + 1 : 0;

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // 한글 조합 중 Enter 무시
    if (e.key === 'ArrowDown' && optionCount) {
      e.preventDefault();
      setActive((i) => (i + 1) % optionCount);
    } else if (e.key === 'ArrowUp' && optionCount) {
      e.preventDefault();
      setActive((i) => (i - 1 + optionCount) % optionCount);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active < visible.length && visible[active]) openPost(visible[active].post);
      else viewAll();
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type='button'
          aria-label='검색'
          className={cn(
            'inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
            'size-9 justify-center md:h-9 md:w-52 md:justify-start md:border md:border-border md:bg-muted/40 md:px-3'
          )}
        >
          <Search className='size-4 shrink-0' />
          <span className='hidden flex-1 text-left md:inline'>검색</span>
          <span className='hidden items-center gap-0.5 md:flex'>
            <Kbd>{isMac ? '⌘' : 'Ctrl'}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0' />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).querySelector('input')?.focus();
          }}
          className={cn(
            'fixed z-50 flex flex-col overflow-hidden bg-background shadow-2xl',
            'inset-0 sm:inset-auto sm:left-1/2 sm:top-[12vh] sm:w-[calc(100%-2rem)] sm:max-w-xl sm:-translate-x-1/2',
            'sm:max-h-[72vh] sm:rounded-2xl sm:border sm:border-border',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95'
          )}
        >
          <DialogPrimitive.Title className='sr-only'>블로그 검색</DialogPrimitive.Title>

          {/* 입력 */}
          <div className='flex items-center gap-2 border-b border-border px-4 pt-[env(safe-area-inset-top)]'>
            <Search className='size-5 shrink-0 text-muted-foreground' aria-hidden />
            <input
              type='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder='제목, 내용, 태그로 검색'
              aria-label='검색어'
              role='combobox'
              aria-expanded={optionCount > 0}
              aria-controls='search-results'
              aria-activedescendant={optionCount ? `search-option-${active}` : undefined}
              enterKeyHint='search'
              autoComplete='off'
              className='h-14 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden'
            />
            {query ? (
              <button
                type='button'
                onClick={() => setQuery('')}
                aria-label='검색어 지우기'
                className='rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
              >
                <X className='size-4' />
              </button>
            ) : null}
            <DialogPrimitive.Close className='shrink-0 text-sm text-muted-foreground hover:text-foreground sm:hidden'>
              취소
            </DialogPrimitive.Close>
            <DialogPrimitive.Close asChild>
              <button type='button' className='hidden sm:block' aria-label='닫기'>
                <Kbd>ESC</Kbd>
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* 결과 */}
          <div
            ref={listRef}
            id='search-results'
            role='listbox'
            className='flex-1 overflow-y-auto overscroll-contain p-2'
          >
            {!posts ? (
              <div className='space-y-2 p-2' aria-busy='true'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='h-14 animate-pulse rounded-lg bg-muted' />
                ))}
              </div>
            ) : !trimmed ? (
              <div className='space-y-4 p-2'>
                {recent.length ? (
                  <section>
                    <h3 className='mb-1.5 px-1 text-xs font-medium text-muted-foreground'>
                      최근 검색
                    </h3>
                    <ul>
                      {recent.map((r) => (
                        <li key={r} className='group flex items-center rounded-lg hover:bg-muted'>
                          <button
                            type='button'
                            onClick={() => setQuery(r)}
                            className='flex flex-1 items-center gap-2.5 px-2 py-2 text-left text-sm'
                          >
                            <History className='size-4 text-muted-foreground' aria-hidden />
                            {r}
                          </button>
                          <button
                            type='button'
                            onClick={() => removeRecent(r)}
                            aria-label={`${r} 삭제`}
                            className='mr-1 rounded p-1 text-muted-foreground opacity-60 hover:bg-background hover:text-foreground group-hover:opacity-100'
                          >
                            <X className='size-3.5' />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                {popularTags.length ? (
                  <section>
                    <h3 className='mb-2 px-1 text-xs font-medium text-muted-foreground'>
                      인기 태그
                    </h3>
                    <div className='flex flex-wrap gap-1.5 px-1'>
                      {popularTags.map((tag) => (
                        <button
                          key={tag}
                          type='button'
                          onClick={() => go(`/?${new URLSearchParams({ tag })}`)}
                          className='hover:border-foreground/30 inline-flex items-center gap-0.5 rounded-full border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:bg-muted'
                        >
                          <Hash className='size-3 text-muted-foreground' aria-hidden />
                          {tag}
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : results.length === 0 ? (
              <div className='flex flex-col items-center gap-2 px-6 py-12 text-center'>
                <SearchX className='size-7 text-muted-foreground/70' aria-hidden />
                <p className='text-sm font-medium text-foreground'>
                  &lsquo;{trimmed}&rsquo;에 대한 결과가 없습니다
                </p>
                <p className='text-xs text-muted-foreground'>다른 키워드나 태그로 찾아보세요.</p>
              </div>
            ) : (
              <>
                <p className='px-2 pb-1.5 pt-1 text-xs text-muted-foreground'>
                  글{' '}
                  <span className='font-medium tabular-nums text-foreground'>{results.length}</span>
                  개
                </p>
                <ul>
                  {visible.map(({ post }, i) => (
                    <li key={post.url}>
                      <button
                        type='button'
                        id={`search-option-${i}`}
                        role='option'
                        aria-selected={active === i}
                        data-index={i}
                        onMouseMove={() => setActive(i)}
                        onClick={() => openPost(post)}
                        className={cn(
                          'flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                          active === i ? 'bg-muted' : ''
                        )}
                      >
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-medium text-foreground'>
                            <Highlight text={post.title} terms={terms} />
                          </p>
                          <p className='mt-0.5 line-clamp-1 text-xs text-muted-foreground'>
                            <Highlight text={makeSnippet(post, terms)} terms={terms} />
                          </p>
                          <p className='mt-1 text-[11px] text-muted-foreground/80'>
                            {categoryName(post.categoryPath)}
                            {post.date ? ` · ${dayjs(post.date).format('YYYY.MM.DD')}` : ''}
                          </p>
                        </div>
                        <CornerDownLeft
                          className={cn(
                            'mt-0.5 size-4 shrink-0 text-muted-foreground',
                            active === i ? 'opacity-100' : 'opacity-0'
                          )}
                          aria-hidden
                        />
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      type='button'
                      id={`search-option-${visible.length}`}
                      role='option'
                      aria-selected={active === visible.length}
                      data-index={visible.length}
                      onMouseMove={() => setActive(visible.length)}
                      onClick={viewAll}
                      className={cn(
                        'mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors',
                        active === visible.length ? 'bg-muted text-foreground' : ''
                      )}
                    >
                      <Search className='size-4' aria-hidden />
                      <span className='flex-1'>
                        &lsquo;<span className='font-medium text-foreground'>{trimmed}</span>&rsquo;
                        전체 결과 보기
                      </span>
                      <ArrowRight className='size-4' aria-hidden />
                    </button>
                  </li>
                </ul>
              </>
            )}
          </div>

          {/* 단축키 안내 */}
          <div className='hidden items-center gap-4 border-t border-border bg-muted/30 px-4 py-2 text-[11px] text-muted-foreground sm:flex'>
            <span className='flex items-center gap-1'>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> 이동
            </span>
            <span className='flex items-center gap-1'>
              <Kbd>↵</Kbd> 열기
            </span>
            <span className='flex items-center gap-1'>
              <Kbd>esc</Kbd> 닫기
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
