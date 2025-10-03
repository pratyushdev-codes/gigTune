
import React from 'react';
import { Gig } from '../types';
import { LocationPinIcon, MusicNoteIcon } from './Icons';

interface GigCardProps {
  gig: Gig;
  onSelect: (gig: Gig) => void;
}

const GigCard: React.FC<GigCardProps> = ({ gig, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(gig)}
      className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex flex-col"
    >
      <div className="flex-grow">
        <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-semibold px-2.5 py-1 rounded-full">{gig.genre}</span>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-3 group-hover:text-purple-500 transition-colors">{gig.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">for {gig.bandName}</p>
        
        <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          <LocationPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{gig.location}</span>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <MusicNoteIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="font-semibold text-gray-700 dark:text-gray-200">{gig.instrumentNeeded}</span> Needed
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-right">
        <span className="text-xs text-gray-400 dark:text-gray-500">
            Posted {new Date(gig.postedDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default GigCard;
