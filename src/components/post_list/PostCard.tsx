import Link from 'next/link';

import { Post } from '@/config/types';

interface Props {
  post: Post;
}

const MAX_VISIBLE_TAGS = 4;

const PostCard = ({ post }: Props) => {
  const tags = post.tags ?? [];
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <Link
      href={post.url}
      className='group block h-full w-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
    >
      <article className='flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm transition duration-200 group-hover:border-foreground/15 group-hover:shadow-md sm:p-6'>
        <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground sm:text-[13px]'>
          <span className='rounded-full bg-pink-50 px-2 py-0.5 font-medium text-pink-700'>
            {post.categoryPublicName}
          </span>
          {post.dateString ? <time dateTime={post.date?.toString()}>{post.dateString}</time> : null}
          <span aria-hidden>·</span>
          <span>{post.readingMinutes}분 읽기</span>
        </div>

        <h2 className='text-balance break-keep text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-pink-600 sm:text-xl'>
          {post.title}
        </h2>

        {post.excerpt || post.desc ? (
          <p className='line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-3 sm:text-[15px]'>
            {post.excerpt || post.desc}
          </p>
        ) : null}

        {visibleTags.length ? (
          <ul className='mt-auto flex flex-wrap items-center gap-1.5 pt-1 text-xs text-muted-foreground'>
            {visibleTags.map((t) => (
              <li key={t} className='rounded-md bg-muted/70 px-2 py-0.5'>
                #{t}
              </li>
            ))}
            {hiddenCount > 0 ? <li className='px-1'>+{hiddenCount}</li> : null}
          </ul>
        ) : null}
      </article>
    </Link>
  );
};

export default PostCard;
