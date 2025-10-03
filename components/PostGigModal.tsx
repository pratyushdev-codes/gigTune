
import React, { useState } from 'react';
import { Gig, Instrument, Genre } from '../types';
import { ALL_INSTRUMENTS, ALL_GENRES } from '../constants';
import { CloseIcon } from './Icons';

interface PostGigModalProps {
  onClose: () => void;
  onPostGig: (gigData: Omit<Gig, 'id' | 'postedDate' | 'status' | 'postedByUserId'>) => void;
}

const PostGigModal: React.FC<PostGigModalProps> = ({ onClose, onPostGig }) => {
  const [title, setTitle] = useState('');
  const [bandName, setBandName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [instrumentNeeded, setInstrumentNeeded] = useState<Instrument>(Instrument.GUITAR);
  const [genre, setGenre] = useState<Genre>(Genre.ROCK);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !bandName || !location || !description) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    onPostGig({
      title,
      bandName,
      location,
      description,
      instrumentNeeded,
      genre,
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post a New Gig</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:hover:text-white" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gig Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Lead Guitarist for Rock Musical" />
          </div>
          <div>
            <label htmlFor="bandName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Band / Artist Name</label>
            <input id="bandName" type="text" value={bandName} onChange={(e) => setBandName(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., Downtown Theatre" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g., New York, NY" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="instrumentNeeded" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instrument Needed</label>
                <select id="instrumentNeeded" value={instrumentNeeded} onChange={e => setInstrumentNeeded(e.target.value as Instrument)} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {ALL_INSTRUMENTS.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre</label>
                <select id="genre" value={genre} onChange={e => setGenre(e.target.value as Genre)} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {ALL_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Provide details about the gig, requirements, payment, etc."/>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="pt-2 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-6 rounded-full hover:bg-purple-700 transition-colors">
              Post Gig
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostGigModal;
