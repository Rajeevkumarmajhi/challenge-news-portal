import React, { useState, useEffect } from 'react';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface DateFilterProps {
  fromDate: string;
  toDate: string;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ fromDate, toDate, onFromChange, onToChange }) => {
  const [selectedFromDate, setSelectedFromDate] = useState(fromDate);
  const [selectedToDate, setSelectedToDate] = useState(toDate);

  useEffect(() => {
    const fromDatePicker = flatpickr(".from-date", {
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        const date = selectedDates[0];
        setSelectedFromDate(date.toLocaleDateString('en-CA'));
        onFromChange(date.toLocaleDateString('en-CA'));
      },
    });

    const toDatePicker = flatpickr(".to-date", {
      dateFormat: "Y-m-d",
      onChange: (selectedDates) => {
        const date = selectedDates[0];
        setSelectedToDate(date.toLocaleDateString('en-CA'));
        onToChange(date.toLocaleDateString('en-CA'));
      },
    });

    return () => {
      if (Array.isArray(fromDatePicker)) fromDatePicker.forEach((instance) => instance.destroy());
      else fromDatePicker.destroy();

      if (Array.isArray(toDatePicker)) toDatePicker.forEach((instance) => instance.destroy());
      else toDatePicker.destroy();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div className="w-full">
        <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">From Date</label>
        <input
          type="text"
          id="fromDate"
          value={selectedFromDate}
          onChange={(e) => onFromChange(e.target.value)}
          className="from-date mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="w-full">
        <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">To Date</label>
        <input
          type="text"
          id="toDate"
          value={selectedToDate}
          onChange={(e) => onToChange(e.target.value)}
          className="to-date mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default DateFilter;
