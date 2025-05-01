import React from 'react';

interface DateFilterProps {
  fromDate: string;
  toDate: string;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ fromDate, toDate, onFromChange, onToChange }) => {
  return (
    <div className="flex gap-4 flex-wrap items-center my-4">
      <label className="flex flex-col text-sm">
        From:
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromChange(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </label>
      <label className="flex flex-col text-sm">
        To:
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToChange(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </label>
    </div>
  );
};

export default DateFilter;
