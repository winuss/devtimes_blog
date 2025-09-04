import TagFilterClient from './TagFilterClient';
import { getAllTags } from '@/lib/post';

// 검색 인덱스에서 데이터를 가져오는 함수 (서버에서만)
async function getSearchIndexData() {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const indexPath = path.join(process.cwd(), 'public', 'search-index.json');
    const data = fs.readFileSync(indexPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load search index:', error);
    return { posts: [] };
  }
}

const TagFilter = async ({ searchParams }: { searchParams?: { q?: string; tag?: string } }) => {
  const tags = await getAllTags();
  const indexData = await getSearchIndexData();
  
  const q = searchParams?.q || '';
  const tag = searchParams?.tag || '';
  
  // 필터링 로직 (PostListClient와 동일)
  const filteredPosts = indexData.posts.filter((post: any) => {
    const byTag = tag ? (post.tags || []).map((t: string) => t.toLowerCase()).includes(tag.toLowerCase()) : true;
    const byQuery = q ? post.searchText.toLowerCase().includes(q.toLowerCase()) : true;
    return byTag && byQuery;
  });
  
  return (
    <TagFilterClient 
      tags={tags} 
      totalPosts={filteredPosts.length}
      currentSearchQuery={q || undefined}
    />
  );
};

export default TagFilter;


