import React from 'react';
import { Instrument, Genre } from '../types';
import FilterDropdown from './FilterDropdown';
import { SearchIcon } from './Icons';

interface SearchAndFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilters: { instruments: string[]; genres: string[] };
  setActiveFilters: React.Dispatch<React.SetStateAction<{ instruments: string[]; genres: string[] }>>;
  instruments: Instrument[];
  genres: Genre[];
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilters,
  setActiveFilters,
  instruments,
  genres,
}) => {

  const handleFilterChange = (category: 'instruments' | 'genres', value: string) => {
    setActiveFilters(prev => {
      const currentCategoryFilters = prev[category];
      const newCategoryFilters = currentCategoryFilters.includes(value)
        ? currentCategoryFilters.filter(item => item !== value)
        : [...currentCategoryFilters, value];
      return { ...prev, [category]: newCategoryFilters };
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center gap-4">
      <div className="relative w-full flex-grow">
        <input
          type="text"
          placeholder="Search musicians by name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full py-2.5 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <FilterDropdown
          title="Instruments"
          items={instruments}
          selectedItems={activeFilters.instruments}
          onFilterChange={(value) => handleFilterChange('instruments', value)}
        />
        <FilterDropdown
          title="Genres"
          items={genres}
          selectedItems={activeFilters.genres}
          onFilterChange={(value) => handleFilterChange('genres', value)}
        />
      </div>
    </div>
  );
};

export default SearchAndFilterBar;