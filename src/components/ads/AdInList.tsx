'use client';

import { useEffect } from 'react';

import { ADSENSE_CLIENT, ADSENSE_LIST_SLOT } from '@/config/const';

const AdInList = () => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (_) {
      // no-op
    }
  }, []);

  if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
    return null;
  }
  if (!ADSENSE_CLIENT || !ADSENSE_LIST_SLOT) {
    return null;
  }

  return (
    <li className='w-full'>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_LIST_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </li>
  );
};

export default AdInList;


