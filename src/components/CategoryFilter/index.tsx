import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onChange }) => {
  return (
    <div className="flex gap-4 flex-wrap mt-4 mb-2">
      <button
        className={`px-4 py-2 rounded ${selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => onChange('')}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`px-4 py-2 rounded ${
            selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
