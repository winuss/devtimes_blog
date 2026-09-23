import TagFilter from './TagFilter';
import PostListClient from './PostListClient';
import { blogDesc } from '@/config/const';

interface PostListProps {
  category?: string;
  page?: number;
  pageSize?: number;
  tag?: string;
  q?: string;
}

const PostListPage = async ({ category, page = 1, pageSize = 12, tag, q }: PostListProps) => {

  return (
    <section className='mx-auto w-full max-w-3xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14'>
      <div className='mb-6 flex items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>최근 글</h1>
          <p className='mt-1.5 text-sm text-muted-foreground sm:text-base'>{blogDesc}</p>
        </div>
        <TagFilter searchParams={{ q, tag }} />
      </div>
      <PostListClient />
    </section>
  );
};

export default PostListPage;
