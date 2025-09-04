'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo, useState, useRef, useEffect } from 'react';
import { TAGS_INITIAL_VISIBLE_COUNT } from '@/config/const';
import { Button } from '@/components/ui/button';
import { ChevronDown, Hash, X } from 'lucide-react';

interface Props {
  tags: string[];
  totalPosts?: number;
  currentSearchQuery?: string;
}

const TagFilterClient = ({ tags, totalPosts, currentSearchQuery }: Props) => {
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
    <div className='mb-6 flex items-center justify-between'>
      {/* 좌측: 총 건수 및 검색어 */}
      <div className='flex flex-wrap items-center gap-2 text-xs text-gray-500'>
        {currentSearchQuery && (
          <span className='rounded-full border px-2 py-1'>검색어: &quot;{currentSearchQuery}&quot;</span>
        )}
        {totalPosts !== undefined && (
          <span className='rounded-full bg-gray-50 px-3 py-1.5 text-sm font-medium dark:bg-slate-800'>총 {totalPosts}건</span>
        )}
      </div>
      
      {/* 우측: 선택된 태그 + 태그 선택 */}
      <div className='flex items-center gap-2'>
        {currentTag && (
          <div className='flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-sm dark:bg-slate-800'>
            <span className='text-muted-foreground'>#{currentTag}</span>
            <button
              onClick={handleTagClear}
              className='ml-1 hover:text-red-500 transition-colors'
              title='태그 필터 제거'
            >
              <X className='size-3' />
            </button>
          </div>
        )}
        
        <div className='relative' ref={dropdownRef}>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='text-xs'
          >
            <Hash className='mr-1 size-3' />
            태그 선택
            <ChevronDown className={`ml-1 size-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isDropdownOpen && (
            <div className='absolute top-full right-0 z-50 mt-1 w-80 rounded-lg border bg-white shadow-lg dark:bg-slate-900'>
              <div className='p-3'>
                <input
                  type='text'
                  placeholder='태그 검색...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full rounded-md border px-3 py-2 text-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-slate-800 dark:border-slate-600'
                />
              </div>
              <div className='max-h-60 overflow-y-auto p-2'>
                <div className='grid grid-cols-2 gap-1'>
                  <button
                    onClick={() => handleTagSelect('all')}
                    className={`rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 ${
                      !currentTag ? 'bg-gray-200 dark:bg-slate-700' : ''
                    }`}
                  >
                    전체
                  </button>
                  {filteredTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      className={`rounded-md px-3 py-2 text-left text-xs transition-colors hover:bg-gray-100 dark:hover:bg-slate-800 ${
                        currentTag === tag ? 'bg-gray-200 dark:bg-slate-700' : ''
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


