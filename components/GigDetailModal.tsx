

import React from 'react';
import { Gig, Musician } from '../types';
import { CloseIcon, LocationPinIcon, MusicNoteIcon } from './Icons';

interface GigDetailModalProps {
  gig: Gig | null;
  onClose: () => void;
  musicians: Musician[];
}

const GigDetailModal: React.FC<GigDetailModalProps> = ({ gig, onClose, musicians }) => {
  if (!gig) return null;

  const postingUser = musicians.find(m => m.id === gig.postedByUserId);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors z-20"
          aria-label="Close gig details"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <div className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <span className="inline-block bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-semibold px-3 py-1 rounded-full mb-2">
                        {gig.genre}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{gig.title}</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mt-1">for {gig.bandName}</p>
                </div>
                {postingUser && (
                    <div className="flex items-center gap-3 mt-4 sm:mt-0 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <img src={postingUser.avatarUrl} alt={postingUser.name} className="w-10 h-10 rounded-full object-cover"/>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Posted by</p>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{postingUser.name}</p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 my-6 text-gray-700 dark:text-gray-300">
                <div className="flex items-center">
                    <LocationPinIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <strong>Location:</strong><span className="ml-2">{gig.location}</span>
                </div>
                <div className="flex items-center">
                    <MusicNoteIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <strong>Instrument:</strong><span className="ml-2">{gig.instrumentNeeded}</span>
                </div>
            </div>
            
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Gig Description</h3>
                <p>{gig.description}</p>
            </div>
            
             <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                    Close
                </button>
                <button onClick={() => alert('Application sent!')} className="bg-purple-600 text-white font-bold py-2 px-6 rounded-full hover:bg-purple-700 transition-colors">
                    Apply Now
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetailModal;
