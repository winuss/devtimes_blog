const PostCardSkeleton = () => {
  return (
    <li className='flex h-full w-full animate-pulse flex-col overflow-hidden rounded-xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
      <div className='flex w-full flex-1 flex-col justify-between p-5'>
        <div className='w-full'>
          <div className='flex w-full items-center justify-between gap-2'>
            <div className='h-6 w-2/3 rounded bg-gray-200 dark:bg-slate-700' />
            <div className='h-5 w-20 rounded bg-pink-100 dark:bg-pink-400/10' />
          </div>
          <div className='my-3 h-px w-full bg-gray-100 dark:bg-gray-800' />
        </div>

        <div className='mb-4 w-full space-y-2'>
          <div className='h-4 w-full rounded bg-gray-200 dark:bg-slate-700' />
          <div className='h-4 w-11/12 rounded bg-gray-200 dark:bg-slate-700' />
          <div className='h-4 w-10/12 rounded bg-gray-200 dark:bg-slate-700' />
          <div className='h-4 w-9/12 rounded bg-gray-200 dark:bg-slate-700' />
          <div className='h-4 w-8/12 rounded bg-gray-200 dark:bg-slate-700' />
        </div>

        <div className='mb-3 flex flex-wrap items-center gap-2'>
          <div className='h-5 w-14 rounded-full border bg-gray-100 dark:border-slate-800 dark:bg-slate-800' />
          <div className='h-5 w-12 rounded-full border bg-gray-100 dark:border-slate-800 dark:bg-slate-800' />
          <div className='h-5 w-16 rounded-full border bg-gray-100 dark:border-slate-800 dark:bg-slate-800' />
        </div>

        <div className='flex w-full items-center justify-between text-sm'>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-20 rounded bg-gray-200 dark:bg-slate-700' />
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-10 rounded bg-gray-200 dark:bg-slate-700' />
          </div>
        </div>
      </div>
    </li>
  );
};

export default PostCardSkeleton;


