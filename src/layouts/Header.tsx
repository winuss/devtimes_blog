'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import logo from '@/app/icon.png';
import ScrollProgressBar from '@/components/common/ScrollProgressBar';
import { Button } from '@/components/ui/button';
import { useSpyElem } from '@/hook/useSpy';
import { HeaderSearch } from '@/layouts/HeaderSearch';
import { cn } from '@/lib/utils';
import { Github, User } from 'lucide-react';

const mainHome = {
  name: 'DevTimes',
  href: 'https://devtimes.com',
};

// 블로그 내부 메뉴
const navList = [{ name: 'About', href: '/about', icon: User }];

export const Header = () => {
  const pathname = usePathname();
  const isMainList = pathname === '/';
  const { ref, marginTop } = useSpyElem(65);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      style={{ marginTop: isMainList ? marginTop : 0 }}
      ref={ref}
      className={cn(
        'z-40 flex w-full flex-col items-center justify-center border-b border-border/80 print:hidden',
        'bg-background/80 supports-[backdrop-filter]:bg-background/70 shadow-sm shadow-black/[0.03] backdrop-blur-md',
        'dark:shadow-black/20',
        isMainList ? 'fixed' : 'static'
      )}
    >
      <div className='flex h-16 w-full max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6'>
        {/* Brand */}
        <div className='flex items-center gap-2'>
          <Link
            href={mainHome.href}
            target='_blank'
            rel='noopener noreferrer'
            className='group inline-flex items-center gap-2'
          >
            <Image
              src={logo}
              alt=''
              aria-hidden
              className='h-6 w-6 shrink-0 transition-opacity duration-200 group-hover:opacity-80'
            />
            <span className='text-xl font-bold tracking-tight'>{mainHome.name}</span>
          </Link>
          <Link
            href='/'
            className='rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
          >
            Blog
          </Link>
        </div>

        <div className='flex items-center gap-1'>
          {navList.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:bg-muted',
                isActive(href)
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className='size-4' />
              <span className='hidden sm:inline'>{name}</span>
            </Link>
          ))}
          <span className='mx-2 hidden h-4 w-px bg-border sm:block' aria-hidden />
          <HeaderSearch />
          <Button asChild variant='ghost' size='icon'>
            <Link
              href='https://github.com/winuss'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
            >
              <Github className='size-[1.2rem]' />
            </Link>
          </Button>
        </div>
      </div>
      <ScrollProgressBar />
    </nav>
  );
};
