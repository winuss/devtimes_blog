import Link from 'next/link';

import IconGithub from '@/components/icon/Github';
import IconLinkedin from '@/components/icon/LinkedIn';

export const Footer = () => {
  return (
    <footer className='mt-auto flex flex-col items-center justify-center gap-6 border-t border-border/80 bg-muted/30 py-14 text-center print:hidden dark:bg-muted/10'>
      <div className='flex justify-center gap-5'>
        <Link
          href='https://github.com/winuss'
          target='_blank'
          className='rounded-full p-2 text-foreground ring-1 ring-border/60 transition hover:bg-background hover:text-pink-600 hover:ring-pink-500/30'
        >
          <IconGithub className='fill-current transition' height={26} width={26} />
        </Link>
        <Link
          href='https://www.linkedin.com/in/'
          target='_blank'
          className='rounded-full p-2 text-foreground ring-1 ring-border/60 transition hover:bg-background hover:text-pink-600 hover:ring-pink-500/30'
        >
          <IconLinkedin className='fill-current transition' height={26} width={26} />
        </Link>
      </div>
      <p className='text-sm text-muted-foreground'>
        © {new Date().getFullYear()}{' '}
        <span className='font-semibold text-foreground'>Devtimes Blog</span> · All rights reserved.
      </p>
    </footer>
  );
};
