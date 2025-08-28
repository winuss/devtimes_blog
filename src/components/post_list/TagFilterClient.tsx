'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { TAGS_INITIAL_VISIBLE_COUNT } from '@/config/const';

interface Props {
  tags: string[];
}

const TagFilterClient = ({ tags }: Props) => {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag') || undefined;
  const [expanded, setExpanded] = useState(false);
  const initialCount = Math.max(0, TAGS_INITIAL_VISIBLE_COUNT);
  const hasOverflow = tags.length > initialCount;
  const visibleTags = useMemo(() => (expanded || !hasOverflow ? tags : tags.slice(0, initialCount)), [expanded, hasOverflow, tags, initialCount]);

  if (!tags.length) return null;

  return (
    <div className='mb-6 flex w-full flex-wrap items-center gap-2'>
      <Link
        href='/'
        className={`rounded-full border px-3 py-1 text-xs ${!currentTag ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
      >
        All
      </Link>
      {visibleTags.map((t) => (
        <Link
          key={t}
          href={`/?tag=${encodeURIComponent(t)}`}
          className={`rounded-full border px-3 py-1 text-xs ${currentTag === t ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
        >
          #{t}
        </Link>
      ))}
      {hasOverflow ? (
        <button
          type='button'
          onClick={() => setExpanded((v) => !v)}
          className='ml-auto inline-flex items-center rounded-full border px-3 py-1 text-xs hover:bg-gray-100 dark:hover:bg-slate-800'
          aria-expanded={expanded}
        >
          {expanded ? '접기' : `더보기 · ${tags.length - visibleTags.length}개`}
        </button>
      ) : null}
    </div>
  );
};

export default TagFilterClient;


