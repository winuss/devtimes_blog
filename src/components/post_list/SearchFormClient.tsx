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
        className='w-full rounded-md border bg-white px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg.white dark:text-black'
      />
      {tag ? <input type='hidden' name='tag' value={tag} /> : null}
      <button className='inline-flex items-center justify-center whitespace-nowrap rounded-md border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800'>
        검색
      </button>
    </form>
  );
};

export default SearchFormClient;


