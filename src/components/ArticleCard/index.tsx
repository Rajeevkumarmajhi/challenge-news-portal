// src/components/ArticleCard/index.tsx
import React from 'react';
import { Article } from '@/types/Article';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-48 object-cover rounded"
      />
      <h2 className="text-xl font-bold mt-2">{article.title}</h2>
      <p className="text-gray-600 text-sm">
        {new Date(article.publishedAt).toLocaleString()}
      </p>
      <p className="mt-2">{article.description}</p>
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline mt-2 block"
      >
        Read more
      </a>
      <span className="text-xs text-gray-500">Source: {article.source}</span>
    </div>
  );
};

export default ArticleCard;
