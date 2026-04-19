const PostCardSkeleton = () => {
  return (
    <div className='flex h-full w-full animate-pulse flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm ring-1 ring-black/[0.04] dark:ring-white/[0.06]'>
      <div className='flex w-full flex-1 flex-col justify-between gap-4 p-5 sm:p-6'>
        <div className='w-full space-y-3'>
          <div className='flex flex-col gap-2 sm:flex-row sm:justify-between'>
            <div className='h-7 w-4/5 rounded-lg bg-muted sm:w-2/3' />
            <div className='h-6 w-16 shrink-0 rounded-full bg-pink-100 dark:bg-pink-400/10' />
          </div>
          <div className='h-px w-full bg-border/80' />
        </div>

        <div className='w-full space-y-2.5'>
          <div className='h-4 w-full rounded-md bg-muted' />
          <div className='h-4 w-[92%] rounded-md bg-muted' />
          <div className='h-4 w-[88%] rounded-md bg-muted' />
          <div className='h-4 w-[70%] rounded-md bg-muted' />
        </div>

        <div className='flex flex-wrap gap-2'>
          <div className='h-6 w-14 rounded-full border border-border/60 bg-muted/50' />
          <div className='h-6 w-12 rounded-full border border-border/60 bg-muted/50' />
          <div className='h-6 w-16 rounded-full border border-border/60 bg-muted/50' />
        </div>

        <div className='flex items-center justify-between border-t border-border/50 pt-4'>
          <div className='h-4 w-28 rounded-md bg-muted' />
          <div className='h-4 w-12 rounded-md bg-muted' />
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
