import { baseDomain, blogAuthor, blogDesc, blogName } from '@/config/const';
import { getSortedPostList } from '@/lib/post';

export const dynamic = 'force-static';

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// 최신 글 50개를 RSS 2.0으로 제공
export async function GET() {
  const posts = (await getSortedPostList()).slice(0, 50);

  const items = posts
    .map((post) => {
      const url = `${baseDomain}${post.url}`;
      const categories = (post.tags || [])
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join('');
      return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(post.date).toUTCString()}</pubDate><description>${escapeXml(post.desc || '')}</description><author>${escapeXml(blogAuthor)}</author>${categories}</item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(blogName)}</title><link>${baseDomain}</link><description>${escapeXml(blogDesc)}</description><language>ko-KR</language><atom:link href="${baseDomain}/rss.xml" rel="self" type="application/rss+xml"/>${posts[0] ? `<lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>` : ''}${items}</channel></rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
