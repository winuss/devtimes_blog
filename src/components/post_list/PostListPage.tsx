import TagFilter from './TagFilter';
import PostListClient from './PostListClient';

interface PostListProps {
  category?: string;
  page?: number;
  pageSize?: number;
  tag?: string;
  q?: string;
}

const PostListPage = async ({ category, page = 1, pageSize = 12, tag, q }: PostListProps) => {

  return (
    <section className='mx-auto w-full max-w-3xl px-4 pb-20 pt-10 sm:px-6 lg:max-w-4xl lg:px-10'>
      <div className='flex items-center justify-between'>
        <h1 className='text-balance text-xl font-bold tracking-tight text-foreground sm:text-2xl pl-2 pb-4'>
          글 목록
        </h1>
        <TagFilter searchParams={{ q, tag }} />
      </div>
      <PostListClient />
    </section>
  );
};

export default PostListPage;
