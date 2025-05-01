// src/services/guardianService.ts
import { Article } from '@/types/Article';

const GUARDIAN_API_KEY = import.meta.env.VITE_GUARDIAN_API_KEY;
const GUARDIAN_API_URL = 'https://content.guardianapis.com/search';

export const fetchGuardianArticles = async (query: string = ''): Promise<Article[]> => {
    const url = new URL(GUARDIAN_API_URL);
    url.searchParams.set('api-key', GUARDIAN_API_KEY);
    url.searchParams.set('show-fields', 'thumbnail,trailText,byline');
    if (query) url.searchParams.set('q', query);
  
    const response = await fetch(url.toString());
    const data = await response.json();
  
    return data.response.results.map((item: any) => ({
      id: item.id,
      title: item.webTitle,
      description: item.fields?.trailText || '',
      imageUrl: item.fields?.thumbnail || '',
      publishedAt: item.webPublicationDate,
      source: 'Guardian',
      url: item.webUrl,
      author: item.fields?.byline || 'Unknown',
    }));
  };
  