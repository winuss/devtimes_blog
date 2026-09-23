const PostCardSkeleton = () => {
  return (
    <div className='flex h-full w-full animate-pulse flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6'>
      <div className='flex items-center gap-2'>
        <div className='h-5 w-14 rounded-full bg-pink-100' />
        <div className='h-4 w-24 rounded-md bg-muted' />
      </div>
      <div className='h-6 w-4/5 rounded-lg bg-muted sm:w-2/3' />
      <div className='w-full space-y-2'>
        <div className='h-4 w-full rounded-md bg-muted' />
        <div className='h-4 w-[85%] rounded-md bg-muted' />
      </div>
      <div className='flex gap-1.5 pt-1'>
        <div className='h-5 w-14 rounded-md bg-muted/70' />
        <div className='h-5 w-12 rounded-md bg-muted/70' />
        <div className='h-5 w-16 rounded-md bg-muted/70' />
      </div>
    </div>
  );
};

export default PostCardSkeleton;
