import React from "react";

interface AuthorFilterProps {
  authors: string[];
  selectedAuthor: string | null;
  onChange: (author: string) => void;
}

const AuthorFilter: React.FC<AuthorFilterProps> = ({ authors, selectedAuthor, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor="author" className="block text-sm font-medium text-gray-700">
        Author
      </label>
      <select
        id="author"
        value={selectedAuthor || "All"}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        {authors.map((author, idx) => (
          <option key={idx} value={author}>
            {author}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AuthorFilter;
