import TagFilterClient from './TagFilterClient';
import { getAllTags } from '@/lib/post';

const TagFilter = async () => {
  const tags = await getAllTags();
  return <TagFilterClient tags={tags} />;
};

export default TagFilter;


