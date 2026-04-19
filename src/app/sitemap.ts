import { MetadataRoute } from 'next';

import { getSitemapPostList } from '@/lib/post';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postList = await getSitemapPostList();
  const baseUrl = 'https://blog.devtimes.com';

  const latestPostMod = postList.reduce<Date | undefined>(
    (max, entry) => (!max || entry.lastModified > max ? entry.lastModified : max),
    undefined,
  );

  return [
    {
      url: baseUrl,
      lastModified: latestPostMod ?? new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: latestPostMod ?? new Date(),
    },
    ...postList,
  ];
}
