'use client';

import { useSearchParams } from 'next/navigation';

interface Props {
  initialQuery?: string;
}

const SearchFormClient = ({ initialQuery }: Props) => {
  const params = useSearchParams();
  const tag = params.get('tag') || '';
  const q = initialQuery ?? params.get('q') ?? '';

  return (
    <form action='/' className='mb-6 flex gap-2'>
      <input
        name='q'
        defaultValue={q}
        placeholder='검색어를 입력하세요'
        className='w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
      />
      {tag ? <input type='hidden' name='tag' value={tag} /> : null}
      <button
        type='submit'
        className='inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted'
      >
        검색
      </button>
    </form>
  );
};

export default SearchFormClient;


