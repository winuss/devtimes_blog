import { Metadata } from 'next';

import FloatingButton from '@/components/common/FloatingButton';
import Giscus from '@/components/post_detail/Giscus';
import { PostBody } from '@/components/post_detail/PostBody';
import { PostHeader } from '@/components/post_detail/PostHeader';
import TocSidebar from '@/components/post_detail/TableOfContentSidebar';
import TocTop from '@/components/post_detail/TableOfContentTop';
import {
  baseDomain,
  blogAuthor,
  blogAuthorURL,
  blogLocale,
  blogName,
  blogThumbnailURL,
  rssAlternateTypes,
} from '@/config/const';
import { Post } from '@/config/types';
import { getPostDetail, getPostPaths, parsePostAbstract, parseToc } from '@/lib/post';

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

// 허용된 param 외 접근시 404
export const dynamicParams = false;

// 썸네일이 없으면 블로그 기본 이미지로 대체
const getImageURL = (post: Post) =>
  post.thumbnail ? new URL(post.thumbnail, baseDomain).toString() : blogThumbnailURL;

const toISO = (value?: Date | string) => (value ? new Date(value).toISOString() : undefined);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPostDetail(category, slug);
  if (!post) return {};

  const title = `${post.title} | DevTimes Blog`;
  const imageURL = getImageURL(post);

  return {
    title,
    description: post.desc,
    keywords: post.tags,
    alternates: { canonical: post.url, types: rssAlternateTypes },
    openGraph: {
      title,
      description: post.desc,
      type: 'article',
      siteName: blogName,
      locale: blogLocale,
      publishedTime: toISO(post.date),
      modifiedTime: toISO(post.updated ?? post.date),
      authors: [blogAuthorURL],
      tags: post.tags,
      url: post.url,
      images: [imageURL],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.desc,
      images: [imageURL],
    },
  };
}

const buildJsonLd = (post: Post) => {
  const url = `${baseDomain}${post.url}`;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.desc,
      image: [getImageURL(post)],
      datePublished: toISO(post.date),
      dateModified: toISO(post.updated ?? post.date),
      author: { '@type': 'Person', name: blogAuthor, url: blogAuthorURL },
      publisher: { '@type': 'Organization', name: blogName, url: baseDomain },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      inLanguage: 'ko-KR',
      keywords: post.tags?.join(', '),
      articleSection: post.categoryPublicName,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: blogName, item: baseDomain },
        {
          '@type': 'ListItem',
          position: 2,
          name: post.categoryPublicName,
          item: `${baseDomain}/?category=${encodeURIComponent(post.categoryPath)}`,
        },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];
};

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
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(post)) }}
        />
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
