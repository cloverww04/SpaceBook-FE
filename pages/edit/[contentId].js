import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSingleContent } from '../../api/spaceContentData';
import ContentForm from '../../components/ContentForm';

export default function EditContent() {
  const router = useRouter();
  const { contentId } = router.query;
  const [content, setContent] = useState({});

  useEffect(() => {
    getSingleContent(contentId).then((data) => setContent(data));
  }, []);

  return (
    <div>
      <h1 style={{ color: 'white' }}>Edit Content</h1>
      <ContentForm obj={content} />
    </div>
  );
}
