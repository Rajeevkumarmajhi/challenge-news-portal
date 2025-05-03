import React from 'react';
import { Article } from '@/types/Article';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col justify-between h-full">
      {article.videoUrl ? (
        <video
          controls
          poster={article.imageUrl}
          className="w-full h-48 object-cover rounded-lg"
        >
          <source src={article.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : article.imageUrl ? (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg">
          <span className="text-sm text-gray-400">No media available</span>
        </div>
      )}

      <div className="mt-4 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{article.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(article.publishedAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{article.description}</p>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 text-sm font-medium hover:underline mt-2"
        >
          Read more
        </a>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-600">
        {article.author && (
          <span className="bg-gray-100 px-2 py-1 rounded-full">Author: {article.author}</span>
        )}
        <span className="bg-gray-100 px-2 py-1 rounded-full">Source: {article.source}</span>
      </div>
    </div>
  );
};

export default ArticleCard;
