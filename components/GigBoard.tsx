

import React from 'react';
import { Gig } from '../types';
import GigCard from './GigCard.tsx';
import { BriefcaseIcon, PlusIcon } from './Icons';

interface GigBoardProps {
  gigs: Gig[];
  onPostGig: () => void;
  onViewGig: (gig: Gig) => void;
}

const GigBoard: React.FC<GigBoardProps> = ({ gigs, onPostGig, onViewGig }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gig Board</h1>
        <button
          onClick={onPostGig}
          className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105 shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          Post a Gig
        </button>
      </div>

      {gigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map(gig => (
            <GigCard key={gig.id} gig={gig} onSelect={onViewGig} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <BriefcaseIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-600 dark:text-gray-400">The Gig Board is Empty</h2>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Be the first to post a new opportunity!</p>
        </div>
      )}
    </div>
  );
};

export default GigBoard;