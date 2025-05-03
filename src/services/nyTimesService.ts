import axios from 'axios';
import { Article } from '@/types/Article';

const NYT_API_KEY = import.meta.env.VITE_NYTIMES_API_KEY;
const NYT_API_URL = 'https://api.nytimes.com/svc/topstories/v2/home.json';

export const fetchNYTimesArticles = async (
  searchTerm: string = '',
  fromDate?: string,
  toDate?: string,
  category?: string,
  page: number = 1,
  pageSize: number = 5
): Promise<Article[]> => {
  try {
    const params: Record<string, any> = {
      'api-key': NYT_API_KEY,
      'q': searchTerm,  // Pass search term to the API query
      'page': page.toString(),
      'page-size': pageSize.toString(),
    };

    // Optional: Add fromDate and toDate if provided
    if (fromDate) params['begin_date'] = fromDate;
    if (toDate) params['end_date'] = toDate;
    if (category) params['section'] = category;

    const response = await axios.get(NYT_API_URL, {
      params,
    });

    const articles = response.data.results;

    // Filter by search and date range
    const filtered = articles.filter((item: any) => {
      const content = `${item.title} ${item.abstract} ${item.byline}`.toLowerCase();
      const matchesSearch = !searchTerm || content.includes(searchTerm.toLowerCase());

      const publishedDate = new Date(item.published_date);
      const matchesFrom = !fromDate || publishedDate >= new Date(fromDate);
      const matchesTo = !toDate || publishedDate <= new Date(toDate);

      return matchesSearch && matchesFrom && matchesTo;
    });

    // Simulate pagination
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return paginated.map((item: any) => ({
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
