import Link from 'next/link';

import { Post } from '@/config/types';
import matter from 'gray-matter';
import { CalendarDays, Clock3, Tag } from 'lucide-react';

interface Props {
  post: Post;
}
const cleanMarkdownContent = (content: string) => {
  const { content: mdContent } = matter(content);

  return (
    mdContent
      .replace(/~~~[\s\S]*?~~~/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/<[^>]*>/g, '')
      .replace(/^#+\s*/gm, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/^[\s-]*[-+*]\s+/gm, '')
      .replace(/\n\s*\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim()
  );
};

const PostCard = ({ post }: Props) => {
  const plainText = cleanMarkdownContent(post.content);

  return (
    <Link href={post.url} className='group block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'>
      <article className='flex h-full min-h-[8rem] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-card-foreground shadow-sm ring-1 ring-black/[0.04] transition duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-black/[0.06] dark:ring-white/[0.06] dark:hover:ring-white/[0.1]'>
        <div className='flex w-full flex-1 flex-col justify-between gap-4 p-5 sm:p-6'>
          <div className='w-full space-y-3'>
            <div className='flex w-full flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3'>
              <h2 className='text-balance text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl lg:text-2xl'>
                {post.title}
              </h2>
              <span className='inline-flex w-fit shrink-0 rounded-full bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-700 dark:bg-pink-400/15 dark:text-pink-300'>
                {post.categoryPublicName}
              </span>
            </div>
            <div className='h-px w-full bg-border/80' />
          </div>

          <p className='line-clamp-4 text-sm leading-relaxed text-muted-foreground sm:line-clamp-5 sm:text-[15px]'>
            {post.excerpt || post.desc || plainText}
          </p>

          {post.tags?.length ? (
            <div className='flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground'>
              <Tag className='h-3.5 w-3.5 shrink-0 opacity-70' aria-hidden />
              {post.tags.map((t) => (
                <span
                  key={t}
                  className='rounded-full border border-border/80 bg-muted/40 px-2 py-0.5 font-medium text-foreground/80 dark:bg-muted/25'
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}

          <div className='flex w-full items-center justify-between gap-3 border-t border-border/50 pt-4 text-xs text-muted-foreground sm:text-sm'>
            <div className='flex items-center gap-1.5'>
              <CalendarDays className='h-4 w-4 shrink-0 opacity-70' aria-hidden />
              <span>{post.dateString}</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Clock3 className='h-4 w-4 shrink-0 opacity-70' aria-hidden />
              <span>{post.readingMinutes}분</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PostCard;
