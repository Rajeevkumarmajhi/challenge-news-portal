import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onChange,
}) => {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 mb-4 whitespace-nowrap">
        {categories.map((category: string) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full border shrink-0 ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => onChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
