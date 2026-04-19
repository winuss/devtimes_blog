'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const go = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      className='mt-12 flex items-center justify-between gap-3 border-t border-border/60 pt-8'
      aria-label='페이지 탐색'
    >
      <button
        type='button'
        className='rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40'
        disabled={currentPage <= 1}
        onClick={() => go(currentPage - 1)}
      >
        이전
      </button>
      <span className='rounded-full bg-muted/60 px-4 py-2 text-sm tabular-nums text-muted-foreground'>
        {currentPage} / {totalPages}
      </span>
      <button
        type='button'
        className='rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40'
        disabled={currentPage >= totalPages}
        onClick={() => go(currentPage + 1)}
      >
        다음
      </button>
    </nav>
  );
}


