'use client';

import { Button } from '../ui/button';
import { ArrowUpToLine, MessageSquareText } from 'lucide-react';

interface ButtonProps {
  size?: number;
  className?: string;
}

export const ScrollTop = ({ size = 16, className }: ButtonProps) => {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <Button
      variant='outline'
      size='icon'
      onClick={scrollTop}
      className={className}
      aria-label='맨 위로'
      title='맨 위로'
    >
      <ArrowUpToLine size={size} />
    </Button>
  );
};

export const ScrollToComment = ({ size = 16, className }: ButtonProps) => {
  const scrollToGiscus = () =>
    document.querySelector('.giscus')?.scrollIntoView({ behavior: 'smooth' });
  return (
    <Button
      variant='outline'
      size='icon'
      onClick={scrollToGiscus}
      className={className}
      aria-label='댓글로 이동'
      title='댓글로 이동'
    >
      <MessageSquareText size={size} />
    </Button>
  );
};
