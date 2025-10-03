
import React from 'react';
import { Instrument, Genre } from '../types';

interface FilterPanelProps {
  activeFilters: { instruments: string[]; genres: string[] };
  setActiveFilters: React.Dispatch<React.SetStateAction<{ instruments: string[]; genres: string[] }>>;
  instruments: Instrument[];
  genres: Genre[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ activeFilters, setActiveFilters, instruments, genres }) => {
  
  const handleFilterChange = (category: 'instruments' | 'genres', value: string) => {
    setActiveFilters(prev => {
      const currentCategoryFilters = prev[category];
      const newCategoryFilters = currentCategoryFilters.includes(value)
        ? currentCategoryFilters.filter(item => item !== value)
        : [...currentCategoryFilters, value];
      return { ...prev, [category]: newCategoryFilters };
    });
  };

  const FilterGroup = <T,>({ title, items, selectedItems, category }: { title: string, items: T[], selectedItems: string[], category: 'instruments' | 'genres' }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-300 mb-3 border-b border-gray-700 pb-2">{title}</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {items.map((item) => (
          <label key={String(item)} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500 focus:ring-2 focus:ring-offset-0"
              checked={selectedItems.includes(String(item))}
              onChange={() => handleFilterChange(category, String(item))}
            />
            <span className="text-gray-400 group-hover:text-white transition-colors">{String(item)}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-white">Filters</h2>
        <FilterGroup title="Instruments" items={instruments} selectedItems={activeFilters.instruments} category="instruments" />
        <FilterGroup title="Genres" items={genres} selectedItems={activeFilters.genres} category="genres" />
    </div>
  );
};

export default FilterPanel;
