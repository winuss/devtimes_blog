import Link from 'next/link';

import { Post } from '@/config/types';
import { CalendarDays, Clock3 } from 'lucide-react';

interface Props {
  post: Post;
}

export const PostHeader = ({ post }: Props) => {
  return (
    <header className='mt-12 border-b border-border/70 pb-10 text-center sm:mt-16'>
      <h1 className='mx-auto max-w-[42rem] text-balance text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl'>
        {post.title}
      </h1>
      <div className='mt-5'>
        <Link
          href={`/${post.categoryPath}`}
          className='inline-flex items-center rounded-full bg-muted/60 px-3 py-1 text-sm font-medium text-pink-600 no-underline transition hover:bg-muted hover:underline dark:text-pink-400'
        >
          {post.categoryPublicName}
        </Link>
      </div>
      <div className='mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground'>
        <div className='flex items-center gap-1.5'>
          <CalendarDays className='size-4 shrink-0 opacity-70' aria-hidden />
          <span>{post.dateString}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <Clock3 className='size-4 shrink-0 opacity-70' aria-hidden />
          <span>{post.readingMinutes}분 읽기</span>
        </div>
      </div>
    </header>
  );
};
