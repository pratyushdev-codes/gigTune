import React from 'react';
import { Musician } from '../types';
import { LocationPinIcon, StarIcon } from './Icons';

interface MusicianCardProps {
  musician: Musician;
  onSelect: (musician: Musician) => void;
}

const MusicianCard: React.FC<MusicianCardProps> = ({ musician, onSelect }) => {
  const averageRating = musician.reviews.length > 0
    ? musician.reviews.reduce((acc, review) => acc + review.rating, 0) / musician.reviews.length
    : 0;
  
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex flex-col"
      onClick={() => onSelect(musician)}
    >
      <img src={musician.avatarUrl} alt={musician.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-500 transition-colors">{musician.name}</h3>
        <p className="text-purple-500 font-semibold">{musician.instrument}</p>
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <LocationPinIcon className="w-4 h-4 mr-1.5" />
          <span>{musician.location}</span>
        </div>
        {averageRating > 0 && (
          <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
            <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
            <span className="font-bold">{averageRating.toFixed(1)}</span>
            <span className="ml-1 text-gray-500 dark:text-gray-400">({musician.reviews.length} reviews)</span>
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-grow">
          <h4 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 mb-2">Genres</h4>
          <div className="flex flex-wrap gap-2">
            {musician.genres.slice(0, 3).map(genre => (
              <span key={genre} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">{genre}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicianCard;