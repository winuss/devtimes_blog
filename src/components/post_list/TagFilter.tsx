import TagFilterClient from './TagFilterClient';
import { getAllTags } from '@/lib/post';

const TagFilter = async ({ searchParams }: { searchParams?: { q?: string; tag?: string } }) => {
  const tags = await getAllTags();
  const q = searchParams?.q || '';

  return <TagFilterClient tags={tags} currentSearchQuery={q || undefined} />;
};

export default TagFilter;
