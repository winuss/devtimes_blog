import Link from 'next/link';

import { HeadingItem } from '@/config/types';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface Props {
  toc: HeadingItem[];
}

const TableOfContentTop = ({ toc }: Props) => {
  if (toc.length === 0) return null;

  return (
    <details className='not-prose group mt-8 rounded-xl border border-border/70 bg-muted/30 xl:hidden'>
      <summary className='flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden'>
        <span id='table-of-contents-top'>
          목차 <span className='ml-1 font-normal text-muted-foreground'>{toc.length}</span>
        </span>
        <ChevronDown
          className='size-4 text-muted-foreground transition-transform group-open:rotate-180'
          aria-hidden
        />
      </summary>
      <ul className='border-t border-border/60 px-4 py-3 text-sm'>
        {toc.map((item) => (
          <li key={item.link} className={cn(item.indent === 1 && 'pl-4', 'py-1')}>
            <Link
              href={item.link}
              className='text-muted-foreground transition-colors hover:text-pink-600'
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default TableOfContentTop;
