'use client';

import { useState } from 'react';

import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import useWatchTimeout from '@/hook/useWatchTimeout';
import { Check, Copy, XCircle } from 'lucide-react';

interface ButtonProps {
  size?: number;
  className?: string;
  url?: string;
  variant?: 'outline' | 'default';
}

const CopyLinkButton = ({ size = 16, className, url, variant = 'outline' }: ButtonProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  useWatchTimeout(copied, 3000, () => {
    setCopied(false);
  });

  const SuccessToastTitle = (
    <div className='flex items-center gap-3'>
      <Check size={16} /> 링크를 복사했어요
    </div>
  );

  const successToast = () => toast({ title: SuccessToastTitle });

  const FailToastTitle = (
    <div className='flex items-center gap-3'>
      <XCircle size={16} /> 링크 복사에 실패했어요
    </div>
  );

  const failToast = () => toast({ title: FailToastTitle, variant: 'destructive' });

  const handleCopy = async () => {
    const copyUrl = url ? url : window.document.location.href;
    try {
      await navigator.clipboard.writeText(copyUrl);
      setCopied(true);
      successToast();
    } catch (e) {
      console.error(e);
      failToast();
    }
  };

  return (
    <Button variant={variant} size='icon' onClick={handleCopy} className={className} title='링크 복사'>
      <span className='sr-only'>링크 복사</span>
      {copied ? <Check size={size} /> : <Copy size={size} />}
    </Button>
  );
};

export default CopyLinkButton;
