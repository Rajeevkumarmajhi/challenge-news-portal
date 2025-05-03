import React from 'react';

interface SourceFilterProps {
  selectedSource: string | null;
  onChange: (source: string) => void;
}

const SourceFilter: React.FC<SourceFilterProps> = ({ selectedSource, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
        Source
      </label>
      <select
        id="source"
        value={selectedSource || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      >
        <option value="">All Sources</option>
        <option value="NewsAPI">NewsAPI</option>
        <option value="Guardian">Guardian</option>
        <option value="NYTimes">NYTimes</option>
      </select>
    </div>
  );
};

export default SourceFilter;