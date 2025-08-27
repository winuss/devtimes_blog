'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Props {
  tags: string[];
}

const TagFilterClient = ({ tags }: Props) => {
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag') || undefined;

  if (!tags.length) return null;

  return (
    <div className='mb-6 flex w-full flex-wrap gap-2'>
      <Link
        href='/'
        className={`rounded-full border px-3 py-1 text-xs ${!currentTag ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
      >
        All
      </Link>
      {tags.map((t) => (
        <Link
          key={t}
          href={`/?tag=${encodeURIComponent(t)}`}
          className={`rounded-full border px-3 py-1 text-xs ${currentTag === t ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
        >
          #{t}
        </Link>
      ))}
    </div>
  );
};

export default TagFilterClient;


