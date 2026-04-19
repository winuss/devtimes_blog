import PostListPage from '@/components/post_list/PostListPage';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ page?: string; tag?: string; q?: string }>;
};

export const dynamic = 'force-static';

const Blog = async ({ searchParams }: Props) => {
  const params = await searchParams;
  const page = Number(params?.page || '1');
  const tag = params?.tag;
  const q = params?.q;
  if (Number.isNaN(page) || page < 1) redirect('/');
  return (
    <div className='min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/25 via-background to-background dark:from-muted/10'>
      <PostListPage page={page} tag={tag} q={q} />
    </div>
  );
};

export default Blog;
