import { MdxComponents } from '../mdx';
import { Post } from '@/config/types';
import Link from 'next/link';
import { getRelatedPosts, getSeriesNav } from '@/lib/post';
// @ts-expect-error no types
import remarkA11yEmoji from '@fec/remark-a11y-emoji';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface Props {
  post: Post;
}

export const PostBody = async ({ post }: Props) => {
  const related = await getRelatedPosts(post, 5);
  const series = await getSeriesNav(post);
  return (
    <div className='prose prose-neutral max-w-none dark:prose-invert'>
      <MDXRemote
        source={post.content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkA11yEmoji, remarkBreaks],
            rehypePlugins: [
              [
                // @ts-ignore
                rehypePrettyCode,
                { theme: { dark: 'github-dark-dimmed', light: 'github-light' } },
              ],
              rehypeSlug,
            ],
          },
        }}
        components={MdxComponents}
      />
      {post.tags?.length ? (
        <div className='not-prose mt-10 flex flex-wrap gap-2 border-t border-border/60 pt-8'>
          {post.tags.map((t) => (
            <Link
              key={t}
              href={`/?tag=${encodeURIComponent(t)}`}
              className='rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-sm font-medium text-foreground transition hover:border-pink-500/40 hover:bg-pink-50/80 hover:text-pink-700 dark:hover:bg-pink-950/40 dark:hover:text-pink-300'
            >
              #{t}
            </Link>
          ))}
        </div>
      ) : null}
      {(series.prev || series.next) && (
        <nav className='not-prose mt-10 flex flex-col gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-muted/15'>
          <div className='min-w-0 flex-1'>
            {series.prev && (
              <Link
                href={series.prev.url}
                className='block truncate text-sm font-medium text-foreground underline-offset-4 hover:underline'
              >
                ← 이전: {series.prev.title}
              </Link>
            )}
          </div>
          <div className='min-w-0 flex-1 text-right'>
            {series.next && (
              <Link
                href={series.next.url}
                className='block truncate text-sm font-medium text-foreground underline-offset-4 hover:underline'
              >
                다음: {series.next.title} →
              </Link>
            )}
          </div>
        </nav>
      )}
      {related.length ? (
        <div className='not-prose mt-12'>
          <h3 className='mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground'>연관 글</h3>
          <ul className='grid list-none grid-cols-1 gap-2'>
            {related.map((p) => (
              <li key={p.url}>
                <Link
                  href={p.url}
                  className='group flex items-center rounded-lg border border-transparent px-3 py-2.5 text-sm text-foreground transition hover:border-border hover:bg-muted/40'
                >
                  <span className='line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400'>
                    {p.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
