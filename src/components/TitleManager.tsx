import { useEffect } from 'react';

interface TitleManagerProps {
  title: string;
}

export function TitleManager({ title }: TitleManagerProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
