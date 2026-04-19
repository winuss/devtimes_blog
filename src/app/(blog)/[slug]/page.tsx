import { Metadata } from 'next';

import FloatingButton from '@/components/common/FloatingButton';
import Giscus from '@/components/post_detail/Giscus';
import { PostBody } from '@/components/post_detail/PostBody';
import { PostHeader } from '@/components/post_detail/PostHeader';
import TocSidebar from '@/components/post_detail/TableOfContentSidebar';
import TocTop from '@/components/post_detail/TableOfContentTop';
import { baseDomain } from '@/config/const';
import { getPostDetail, getPostPaths, parsePostAbstract, parseToc } from '@/lib/post';

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

// 허용된 param 외 접근시 404
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPostDetail(category, slug);

  const title = `${post?.title} | DevTimes Blog`;
  const imageURL = `${baseDomain}${post?.thumbnail}`;

  return {
    title,
    description: post?.desc,

    openGraph: {
      title,
      description: post?.desc,
      type: 'article',
      publishedTime: post?.date.toISOString(),
      url: `${baseDomain}${post?.url}`,
      images: [imageURL],
    },
    twitter: {
      title,
      description: post?.desc,
      images: [imageURL],
    },
  };
}

export function generateStaticParams() {
  const postPaths: string[] = getPostPaths();
  const paramList = postPaths
    .map((path) => parsePostAbstract(path))
    .map((item) => ({ category: item.categoryPath, slug: item.slug }));
  return paramList;
}

const PostDetail = async ({ params }: Props) => {
  const { category, slug } = await params;
  const post = await getPostDetail(category, slug);

  if (post == null) return null;

  const toc = parseToc(post.content);
  return (
    <div className='min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/15 via-background to-background pb-20 dark:from-muted/5'>
      <div className='prose prose-neutral mx-auto w-full max-w-[min(42rem,100%-2rem)] px-4 dark:prose-invert sm:max-w-[46rem] sm:px-6'>
        <PostHeader post={post} />
        <TocTop toc={toc} />
        <article className='relative pt-2'>
          <TocSidebar toc={toc} />
          <PostBody post={post} />
        </article>
        <hr className='my-12 border-border/80' />
        <Giscus />
        <FloatingButton />
      </div>
    </div>
  );
};

export default PostDetail;
