import { Metadata } from 'next';

import { redirect } from 'next/navigation';
import { baseDomain, blogName, blogThumbnailURL } from '@/config/const';
import { getCategoryList, getCategoryPublicName } from '@/lib/post';

type Props = {
  params: { category: string };
  searchParams?: { page?: string; tag?: string; q?: string };
};

// 허용된 param 외 접근시 404
export const dynamicParams = false;
export const dynamic = 'force-static';

export function generateStaticParams() {
  const categoryList = getCategoryList();
  const paramList = categoryList.map((category) => ({ category }));
  return paramList;
}

export async function generateMetadata({ params: { category } }: Props): Promise<Metadata> {
  const cg = getCategoryPublicName(category);
  const title = `${cg} | ${blogName}`;
  const url = `${baseDomain}/${category}`;

  return {
    title,
    openGraph: {
      title,
      url,
      images: [blogThumbnailURL],
    },
    twitter: {
      title,
      images: [blogThumbnailURL],
    },
  };
}

const CategoryPage = async ({ params, searchParams }: Props) => {
  const categoryToTag: Record<string, string> = {
    react: 'react',
    python: 'python',
    ops: 'ops',
    javascript: 'javascript',
    ai: 'ai',
    angular: 'angular',
    datalake: 'datalake',
  };

  const { category } = params;
  const mappedTag = categoryToTag[category];

  const qs = new URLSearchParams();
  if (searchParams?.q) qs.set('q', searchParams.q);
  if (searchParams?.tag) qs.set('tag', searchParams.tag);
  else if (mappedTag) qs.set('tag', mappedTag);

  const target = qs.toString() ? `/?${qs.toString()}` : '/';
  redirect(target);
};

export default CategoryPage;
