'use client';

import Link from 'next/link';

import CopyLinkButton from '../common/CopyLinkButton';
import { ScrollToComment, ScrollTop } from '../common/TocButtons';
import { HeadingItem } from '@/config/types';
import { useHeadingsObserver } from '@/hook/useHeadingsObserver';
import { cn } from '@/lib/utils';

interface Props {
  toc: HeadingItem[];
}

const TableOfContent = ({ toc }: Props) => {
  const activeIdList = useHeadingsObserver('h2, h3');

  return (
    <aside className='not-prose absolute -top-[200px] left-full -mb-[100px] hidden h-[calc(100%+150px)] xl:block '>
      <div className='sticky bottom-0  top-[200px] z-10 ml-[5rem] mt-[200px] w-[200px]'>
        <div className='mb-4 py-2'>
          <div className='mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
            목차
          </div>
          <ul className='border-l border-border text-[13px] leading-snug'>
            {toc.map((item) => {
              const isH3 = item.indent === 1;
              const isIntersecting = activeIdList.includes(item.link);
              return (
                <li
                  key={item.link}
                  className={cn(
                    '-ml-px border-l py-1 pl-3 transition-colors',
                    isH3 && 'pl-6',
                    isIntersecting
                      ? 'border-pink-500 font-medium text-pink-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Link href={item.link}>{item.text}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className='flex gap-2'>
          <ScrollTop />
          <ScrollToComment />
          <CopyLinkButton />
        </div>
      </div>
    </aside>
  );
};

export default TableOfContent;
