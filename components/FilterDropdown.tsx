import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './Icons';

interface FilterDropdownProps<T> {
  title: string;
  items: T[];
  selectedItems: string[];
  onFilterChange: (value: string) => void;
}

const FilterDropdown = <T,>({ title, items, selectedItems, onFilterChange }: FilterDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCount = selectedItems.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 text-gray-800 dark:text-gray-200 hover:border-purple-500 transition-colors"
      >
        <span className="font-medium">
            {title} {selectedCount > 0 && `(${selectedCount})`}
        </span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-30 animate-fade-in p-2 max-h-72 overflow-y-auto">
          {items.map((item) => (
            <label key={String(item)} className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                checked={selectedItems.includes(String(item))}
                onChange={() => onFilterChange(String(item))}
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">{String(item)}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;