'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import PostCard from './PostCard';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { SearchX, X } from 'lucide-react';

import { CATEGORY_DISPLAY_NAMES } from '@/config/const';

const AdInList = dynamic(() => import('@/components/ads/AdInList'), { ssr: false });
import PostCardSkeleton from './PostCardSkeleton';
import Pagination from './Pagination';

type SearchIndexPost = {
  url: string;
  slug: string;
  categoryPath: string;
  title: string;
  desc?: string;
  tags?: string[];
  date?: string;
  thumbnail?: string;
  content: string;
  searchText: string;
};

const PAGE_SIZE = 12;

export default function PostListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const tag = searchParams.get('tag') || '';
  const category = searchParams.get('category') || '';
  const page = Math.max(1, Number(searchParams.get('page') || '1'));

  const [allPosts, setAllPosts] = useState<SearchIndexPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setIsLoading(true);
        
        // 로컬스토리지에서 캐시된 데이터 확인
        const cachedData = localStorage.getItem('search-index-cache');
        const cachedVersion = localStorage.getItem('search-index-version');
        
        const headers: HeadersInit = {};
        if (cachedVersion) {
          headers['If-None-Match'] = cachedVersion;
        }
        
        const res = await fetch('/search-index.json', { 
          cache: 'default',
          headers
        });
        
        if (res.status === 304 && cachedData) {
          // 304 Not Modified - 캐시된 데이터 사용
          const data = JSON.parse(cachedData);
          if (!cancelled) setAllPosts(data.posts || []);
        } else if (res.ok) {
          // 새 데이터 받아옴
          const data = await res.json();
          if (!cancelled) {
            setAllPosts(data.posts || []);
            // 새 데이터를 로컬스토리지에 캐시
            localStorage.setItem('search-index-cache', JSON.stringify(data));
            localStorage.setItem('search-index-version', data.version || '');
          }
        } else {
          throw new Error(`failed to fetch index: ${res.status}`);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'failed to load');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const byCategory = (p: SearchIndexPost) => (category ? p.categoryPath === category : true);
    const byTag = (p: SearchIndexPost) => (tag ? (p.tags || []).map((t) => t.toLowerCase()).includes(tag.toLowerCase()) : true);
    const byQuery = (p: SearchIndexPost) => (q ? p.searchText.toLowerCase().includes(q.toLowerCase()) : true);
    return allPosts.filter((p) => byCategory(p) && byTag(p) && byQuery(p));
  }, [allPosts, tag, q, category]);

  const sorted = useMemo(() => {
    // 작성일 최신순 정렬 (내림차순)
    return [...filtered].sort((a, b) => {
      const av = a.date ? dayjs(a.date).valueOf() : 0;
      const bv = b.date ? dayjs(b.date).valueOf() : 0;
      return bv - av;
    });
  }, [filtered]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const items = sorted.slice(start, start + PAGE_SIZE);

  const getCategoryPublicName = (dir: string) =>
    CATEGORY_DISPLAY_NAMES[dir] ??
    dir
      .split('_')
      .map((token) => (token ? token[0].toUpperCase() + token.slice(1) : token))
      .join(' ');

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete('page');
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const activeFilters = [
    q && { key: 'q', label: `"${q}"` },
    category && { key: 'category', label: getCategoryPublicName(category) },
    tag && { key: 'tag', label: `#${tag}` },
  ].filter(Boolean) as { key: string; label: string }[];

  const estimateReadingMinutes = (text: string) => {
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const makeExcerpt = (text: string, maxLen = 240) => {
    if (!text) return '';
    const t = text.trim();
    if (t.length <= maxLen) return t;
    const sliced = t.slice(0, maxLen);
    const lastSpace = sliced.lastIndexOf(' ');
    return (lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced).concat('…');
  };

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const stripLeadingTitle = (text: string, title?: string) => {
    if (!text || !title) return text;
    const pattern = new RegExp('^\\s*' + escapeRegExp(title) + '(?:\n|\s|:|—|-)*', 'i');
    return text.replace(pattern, '');
  };

  if (isLoading)
    return (
      <section aria-busy='true'>
        <div className='mb-5 h-5 w-24 animate-pulse rounded-md bg-muted' />
        <ul className='grid list-none grid-cols-1 gap-4 sm:gap-5'>
          {Array.from({ length: 6 }).map((_, idx) => (
            <li key={idx} className='min-w-0'>
              <PostCardSkeleton />
            </li>
          ))}
        </ul>
      </section>
    );
  if (error)
    return (
      <div className='rounded-2xl border border-border/70 bg-card px-6 py-12 text-center text-sm text-muted-foreground'>
        글 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        <span className='mt-1 block text-xs opacity-70'>{error}</span>
      </div>
    );

  return (
    <section>
      <div className='mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground'>
        <span>
          {activeFilters.length ? '검색 결과 ' : '전체 '}
          <strong className='font-semibold tabular-nums text-foreground'>{total}</strong>개
        </span>
        {activeFilters.map((f) => (
          <button
            key={f.key}
            type='button'
            onClick={() => removeParam(f.key)}
            className='inline-flex items-center gap-1 rounded-full border border-border/80 bg-background py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-foreground transition hover:border-foreground/30'
            aria-label={`${f.label} 필터 해제`}
          >
            {f.label}
            <X className='size-3.5 text-muted-foreground' aria-hidden />
          </button>
        ))}
        {activeFilters.length > 1 ? (
          <Link href='/' className='text-xs underline-offset-4 hover:text-foreground hover:underline'>
            모두 해제
          </Link>
        ) : null}
      </div>

      {total === 0 ? (
        <div className='flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center'>
          <SearchX className='size-8 text-muted-foreground/70' aria-hidden />
          <p className='text-base font-medium text-foreground'>조건에 맞는 글이 없습니다</p>
          <p className='text-sm text-muted-foreground'>다른 검색어나 태그로 다시 찾아보세요.</p>
          <Link
            href='/'
            className='mt-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted'
          >
            전체 글 보기
          </Link>
        </div>
      ) : null}

      <ul className='grid list-none grid-cols-1 gap-4 sm:gap-5'>
        {items.map((p, idx) => {
          const baseForExcerpt = stripLeadingTitle(p.searchText || '', p.title || '');
          const runtimePost: any = {
            ...p,
            dateString: p.date ? dayjs(p.date).format('YYYY.MM.DD') : '',
            readingMinutes: estimateReadingMinutes(p.content),
            categoryPublicName: getCategoryPublicName(p.categoryPath),
            excerpt: makeExcerpt(baseForExcerpt, 220),
          };
          return (
            <Fragment key={`row-${p.url}-${p.date || ''}`}>
              <li className='min-w-0'>
                <PostCard post={runtimePost} />
              </li>
              {(idx + 1) % 4 === 0 ? <AdInList key={`ad-${p.url}-${idx}`} /> : null}
            </Fragment>
          );
        })}
      </ul>
      <Pagination currentPage={page} totalPages={totalPages} />
    </section>
  );
}


