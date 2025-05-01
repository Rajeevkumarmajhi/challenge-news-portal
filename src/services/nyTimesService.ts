import axios from 'axios';
import { Article } from '@/types/Article';

const NYT_API_KEY = import.meta.env.VITE_NYTIMES_API_KEY;
const NYT_API_URL = 'https://api.nytimes.com/svc/topstories/v2/home.json';

export const fetchNYTimesArticles = async (
  searchTerm: string = '',
  fromDate?: string,
  toDate?: string
): Promise<Article[]> => {
  try {
    const response = await axios.get(NYT_API_URL, {
      params: {
        'api-key': NYT_API_KEY,
      },
    });

    const articles = response.data.results;

    const filtered = articles.filter((item: any) => {
      const content = `${item.title} ${item.abstract} ${item.byline}`.toLowerCase();
      const matchesSearch = !searchTerm || content.includes(searchTerm.toLowerCase());

      const publishedDate = new Date(item.published_date);
      const matchesFrom = !fromDate || publishedDate >= new Date(fromDate);
      const matchesTo = !toDate || publishedDate <= new Date(toDate);

      return matchesSearch && matchesFrom && matchesTo;
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
      videoUrl: item.multimedia?.find((m: any) => m.format === "video")?.url || undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch NYTimes articles:', error);
    return [];
  }
};
