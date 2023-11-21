import React from 'react';
import { useRouter } from 'next/router';
import SingleContent from '../components/SingleContent';

export default function ViewSingleContent() {
  const router = useRouter();
  const { contentId } = router.query;

  return (
    <SingleContent contentId={contentId} />
  );
}
