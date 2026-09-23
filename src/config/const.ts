export const baseDomain = 'https://blog.devtimes.com';

export const blogName = 'DEVTIMES 개발 블로그';
export const blogDesc = '개발 지식과 경험을 공유합니다.';

export const blogThumbnailURL = `${baseDomain}/blog_thumbnail.png`;

// SEO 공통 값
export const blogAuthor = 'Yoo Seongsu';
export const blogAuthorURL = 'https://github.com/winuss';
export const blogLocale = 'ko_KR';
// 페이지에서 alternates를 지정하면 상위 값이 통째로 대체되므로 RSS 링크를 함께 넘긴다
export const rssAlternateTypes = {
  'application/rss+xml': [{ url: '/rss.xml', title: blogName }],
};

// AdSense 설정
export const ADSENSE_CLIENT = 'ca-pub-1154659137489563';
export const ADSENSE_LIST_SLOT = '5130375812';

// 태그 필터 표시 기본 개수 (나머지는 접기)
export const TAGS_INITIAL_VISIBLE_COUNT = 12;

// 기본 규칙(dir_name -> Dir Name)으로 표기가 어색한 카테고리 이름
export const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  ai: 'AI',
  javascript: 'JavaScript',
};
