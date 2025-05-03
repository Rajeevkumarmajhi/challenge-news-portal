import axios from 'axios';
import { Article } from '@/types/Article';

const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
const GUARDIAN_API_URL = 'https://content.guardianapis.com/search';

export const fetchGuardianArticles = async (
  query: string = '',
  fromDate?: string,
  toDate?: string,
  category?: string,
  page: number = 1,
  pageSize: number = 5
): Promise<Article[]> => {
  const params: Record<string, string> = {
    'api-key': GUARDIAN_API_KEY,
    'show-fields': 'thumbnail,trailText,byline',
    'page': page.toString(),
    'page-size': pageSize.toString(),
  };

  if (query) params.q = query;
  if (fromDate) params['from-date'] = fromDate;
  if (toDate) params['to-date'] = toDate;
  if (category) params['section'] = category.toLowerCase();

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
    category: item.sectionName || 'General',
    videoUrl: item.fields?.thumbnail?.endsWith('.mp4') ? item.fields?.thumbnail : undefined,
  }));
};
