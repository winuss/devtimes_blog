import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import PostListPage from '@/components/post_list/PostListPage';
import {
  baseDomain,
  blogAuthor,
  blogDesc,
  blogLocale,
  blogName,
  blogThumbnailURL,
  rssAlternateTypes,
} from '@/config/const';

type Props = {
  searchParams: Promise<{ page?: string; tag?: string; q?: string }>;
};

export const dynamic = 'force-static';

// ?tag, ?q, ?page 조합은 모두 목록 페이지이므로 canonical은 '/'로 통일
export const metadata: Metadata = {
  alternates: { canonical: '/', types: rssAlternateTypes },
  openGraph: {
    title: blogName,
    description: blogDesc,
    siteName: blogName,
    url: '/',
    locale: blogLocale,
    images: [blogThumbnailURL],
    type: 'website',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: blogName,
  description: blogDesc,
  url: baseDomain,
  inLanguage: 'ko-KR',
  author: { '@type': 'Person', name: blogAuthor },
};

const Blog = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params?.page || '1');
  const tag = params?.tag;
  const q = params?.q;
  if (Number.isNaN(page) || page < 1) redirect('/');
  return (
    <div className='min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/25 via-background to-background dark:from-muted/10'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <PostListPage page={page} tag={tag} q={q} />
    </div>
  );
};

export default Blog;
