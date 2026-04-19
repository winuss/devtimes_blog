'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Hash, X } from 'lucide-react';

interface Props {
  tags: string[];
  currentSearchQuery?: string;
}

const TagFilterClient = ({ tags, currentSearchQuery }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTag = searchParams.get('tag') || undefined;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 검색된 태그들
  const filteredTags = useMemo(() => {
    if (!searchQuery) return tags;
    return tags.filter(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tags, searchQuery]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTagSelect = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag === 'all') {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    router.push(`/?${params.toString()}`);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleTagClear = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('tag');
    router.push(`/?${params.toString()}`);
  };


  if (!tags.length) return null;

  return (
    <div className='mb-8 flex flex-wrap items-center justify-end gap-2'>
      {currentSearchQuery ? (
        <span className='mr-auto rounded-full border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground sm:text-sm'>
          검색: &quot;{currentSearchQuery}&quot;
        </span>
      ) : null}

      <div className='flex flex-wrap items-center justify-end gap-2'>
        {currentTag && (
          <div className='flex items-center gap-1 rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-sm'>
            <span className='font-medium text-foreground'>#{currentTag}</span>
            <button
              type='button'
              onClick={handleTagClear}
              className='rounded-full p-0.5 text-muted-foreground transition hover:bg-background hover:text-destructive'
              title='태그 필터 제거'
            >
              <X className='size-3.5' />
            </button>
          </div>
        )}

        <div className='relative' ref={dropdownRef}>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='border-border/80 text-xs shadow-sm'
          >
            <Hash className='mr-1 size-3' />
            태그 선택
            <ChevronDown className={`ml-1 size-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isDropdownOpen && (
            <div className='absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,20rem)] rounded-xl border border-border bg-popover text-popover-foreground shadow-lg ring-1 ring-black/5 dark:ring-white/10'>
              <div className='border-b border-border/60 p-3'>
                <input
                  type='text'
                  placeholder='태그 검색...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                />
              </div>
              <div className='max-h-60 overflow-y-auto p-2'>
                <div className='grid grid-cols-2 gap-1'>
                  <button
                    type='button'
                    onClick={() => handleTagSelect('all')}
                    className={`rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors hover:bg-muted ${
                      !currentTag ? 'bg-muted text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    전체
                  </button>
                  {filteredTags.map((tag) => (
                    <button
                      type='button'
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      className={`rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-muted ${
                        currentTag === tag ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                {filteredTags.length === 0 && (
                  <div className='p-4 text-center text-sm text-muted-foreground'>
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagFilterClient;


