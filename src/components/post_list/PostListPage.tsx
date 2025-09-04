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
    <section className='mx-auto mt-6 w-full max-w-4xl px-4 lg:px-8'>
      <section>
        <TagFilter searchParams={{ q, tag }} />
        <PostListClient />
      </section>
    </section>
  );
};

export default PostListPage;
