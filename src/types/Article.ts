export interface Article {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    publishedAt: string; // ISO date string
    source: 'NewsAPI' | 'Guardian' | 'NYTimes';
    url: string;
    author?: string;
    category?: string;
    videoUrl?: string;
  }