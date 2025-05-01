import axios from 'axios';
import { Article } from '@/types/Article';


// Define your API key and endpoint
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_ENDPOINT = 'https://newsapi.org/v2/top-headlines';

export const fetchNewsApiArticles = async (query: string = ''): Promise<Article[]> => {
  try {
    const response = await axios.get(NEWS_API_ENDPOINT, {
      params: {
        q: query || 'news',
        pageSize: 10,
        language: 'en',
        apiKey: NEWS_API_KEY,
      },
    });

    const articles = response.data.articles;

    return articles.map((item: any, index: number) => ({
      id: item.url || `newsapi-${index}`,
      title: item.title,
      description: item.description || '',
      imageUrl: item.urlToImage || '',
      publishedAt: item.publishedAt,
      source: 'NewsAPI',
      url: item.url,
      author: item.author || 'Unknown',
      category: item.source?.name || 'General',
    }));
  } catch (error) {
    console.error('Failed to fetch NewsAPI articles:', error);
    return [];
  }
};
