import axios from 'axios';
import { Article } from '@/types/Article';

const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
const GUARDIAN_API_URL = 'https://content.guardianapis.com/search';

export const fetchGuardianArticles = async (
  query: string = '',
  fromDate?: string,
  toDate?: string
): Promise<Article[]> => {
  const params: Record<string, string> = {
    'api-key': GUARDIAN_API_KEY,
    'show-fields': 'thumbnail,trailText,byline',
  };

  if (query) params.q = query;
  if (fromDate) params['from-date'] = fromDate;
  if (toDate) params['to-date'] = toDate;

  const response = await axios.get(GUARDIAN_API_URL, { params });

  return response.data.response.results.map((item: any) => ({
    id: item.id,
    title: item.webTitle,
    description: item.fields?.trailText || '',
    imageUrl: item.fields?.thumbnail || '',
    publishedAt: item.webPublicationDate,
    source: 'Guardian',
    url: item.webUrl,
    author: item.fields?.byline || 'Unknown',
    category: item.sectionName || 'General', // FIXED: use sectionName at top level
    videoUrl: item.fields?.thumbnail?.endsWith('.mp4') ? item.fields?.thumbnail : undefined,
  }));
  
};
