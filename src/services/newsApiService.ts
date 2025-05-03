import axios from 'axios';
import { Article } from '@/types/Article';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_ENDPOINT = 'https://newsapi.org/v2/everything';

export const fetchNewsApiArticles = async (
  query: string = '',
  fromDate?: string,
  toDate?: string,
  _category?: string,
  page: number = 1,
  pageSize: number = 5
): Promise<Article[]> => {
  try {
    const params: Record<string, string> = {
      q: query || 'news',
      sortBy: 'publishedAt',
      page: page.toString(),
      pageSize: pageSize.toString(),
      language: 'en',
      apiKey: NEWS_API_KEY,
    };

    if (fromDate) params.from = fromDate;
    if (toDate) params.to = toDate;
    if (_category) params.sources = _category; // optionally map to a valid NewsAPI source ID

    const response = await axios.get(NEWS_API_ENDPOINT, { params });

    const articles = response.data.articles;

    return articles.map((item: any, index: number) => ({
      id: item.url || `newsapi-${page}-${index}`,
      title: item.title,
      description: item.description || '',
      imageUrl: item.urlToImage || '',
      publishedAt: item.publishedAt,
      source: 'NewsAPI',
      url: item.url,
      author: item.author || 'Unknown',
      category: item.source?.name || 'General',
      videoUrl: item.urlToImage?.endsWith('.mp4') ? item.urlToImage : undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch NewsAPI articles:', error);
    return [];
  }
};
