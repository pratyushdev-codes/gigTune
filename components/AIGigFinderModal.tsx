import React, { useState } from 'react';
import { Musician } from '../types';
import { CloseIcon, SparklesIcon, SearchIcon } from './Icons';
import { GoogleGenAI, Type } from "@google/genai";

interface AIGigFinderModalProps {
  onClose: () => void;
  allMusicians: Musician[];
  onSelectMusician: (musician: Musician) => void;
}

const AIGigFinderModal: React.FC<AIGigFinderModalProps> = ({ onClose, allMusicians, onSelectMusician }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Musician[]>([]);
  
  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please describe the musician you are looking for.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResults([]);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        // Sanitize musician data for the prompt to only include relevant fields
        const musicianDataForAI = allMusicians.map(m => ({
            id: m.id,
            name: m.name,
            instrument: m.instrument,
            genres: m.genres,
            location: m.location,
            experienceLevel: m.experienceLevel,
            bio: m.bio,
            expertise: m.expertise
        }));
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `User Request: "${query}". Analyze this request and find the best matching musicians from this list: ${JSON.stringify(musicianDataForAI)}`,
            config: {
                systemInstruction: "You are an expert musical talent scout. Your task is to identify suitable candidates based on a user's request and a list of available musicians. Return a JSON array of the musicians' integer IDs only. For example: [1, 5, 12]. If no musicians are a good fit, return an empty array.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.INTEGER,
                    },
                },
            },
        });
        
        const jsonStr = response.text.trim();
        const matchedIds = JSON.parse(jsonStr) as number[];
        
        const matchedMusicians = allMusicians.filter(m => matchedIds.includes(m.id));
        setResults(matchedMusicians);

    } catch (e) {
        console.error(e);
        setError('The AI search failed. This can happen with complex queries. Please try rephrasing your request.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 shadow-2xl relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
                <SparklesIcon className="w-7 h-7 text-purple-500"/>
                <h2 className="text-2xl font-bold text-gray-900">AI Gig Finder</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-800" aria-label="Close">
                <CloseIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6 flex-shrink-0">
            <p className="text-gray-600 mb-4">Describe the musician you're looking for, and our AI assistant will find the best matches for you.</p>
            <div className="flex items-center gap-2">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    rows={2}
                    className="w-full bg-gray-100 border border-gray-300 rounded-md py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="e.g., 'a funk bassist in Miami for a weekend gig' or 'rock guitarist with great improvisation skills'"
                />
                <button 
                    onClick={handleSearch} 
                    disabled={isLoading}
                    className="bg-purple-600 text-white font-bold py-2 px-5 rounded-full hover:bg-purple-700 transition-colors disabled:bg-purple-300 disabled:cursor-wait"
                >
                    <SearchIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>

        <div className="flex-grow p-6 overflow-y-auto bg-gray-50 border-t border-gray-200">
             {isLoading && (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
                    <p className="mt-4 font-semibold text-gray-600">AI is searching...</p>
                </div>
            )}

            {error && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">{error}</p>}
            
            {!isLoading && results.length > 0 && (
                <div>
                    <h3 className="font-bold text-lg mb-4">AI Recommendations:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map(musician => (
                            <div key={musician.id} onClick={() => onSelectMusician(musician)} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer text-center">
                                <img src={musician.avatarUrl} alt={musician.name} className="w-20 h-20 rounded-full mx-auto mb-2 object-cover border-2 border-purple-200"/>
                                <p className="font-bold text-gray-800">{musician.name}</p>
                                <p className="text-sm text-purple-600">{musician.instrument}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && results.length === 0 && !error && (
                 <div className="text-center text-gray-500 py-10">
                    <p>No results yet. Describe a musician above to get started!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AIGigFinderModal;