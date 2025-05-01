// src/services/nyTimesService.ts
import { Article } from '@/types/Article';

const NYT_API_KEY = import.meta.env.VITE_NYTIMES_API_KEY;

// NOTE: NYT Top Stories API doesn't support search, so fallback to Everything API
// Here we simulate search by filtering results on the frontend
const NYT_API_URL = 'https://api.nytimes.com/svc/topstories/v2/home.json';

export const fetchNYTimesArticles = async (searchTerm: string = ''): Promise<Article[]> => {
  const response = await fetch(`${NYT_API_URL}?api-key=${NYT_API_KEY}`);
  const data = await response.json();

  const filtered = data.results.filter((item: any) => {
    if (!searchTerm) return true;
    const text = `${item.title} ${item.abstract} ${item.byline}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return filtered.map((item: any) => ({
    id: item.url,
    title: item.title,
    description: item.abstract,
    imageUrl: item.multimedia?.[0]?.url || '',
    publishedAt: item.published_date,
    source: 'NYTimes',
    url: item.url,
    author: item.byline || 'Unknown',
    category: item.section || '',
  }));
};
