import React, { useState } from 'react';
import { PortfolioItem, PortfolioItemType, Musician } from '../types';
import { CloseIcon, SendIcon } from './Icons';

interface MediaViewerModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  currentUser: Musician;
  onAddComment: (itemId: number, commentText: string) => void;
  onAddReaction: (itemId: number, emoji: string) => void;
}

const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ item, onClose, currentUser, onAddComment, onAddReaction }) => {
  const [newComment, setNewComment] = useState('');
  
  if (!item) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(item.id, newComment.trim());
      setNewComment('');
    }
  };

  const reactionEmojis = ['🔥', '🎸', '👏'];

  const renderMedia = () => {
    switch (item.type) {
      case PortfolioItemType.IMAGE:
        return <img src={item.url} alt={item.title} className="max-w-full max-h-[60vh] object-contain rounded-lg" />;
      case PortfolioItemType.VIDEO:
        return <video src={item.url} controls autoPlay className="max-w-full max-h-[60vh] w-full rounded-lg bg-black" />;
      case PortfolioItemType.AUDIO:
        return (
          <div className="w-full p-4 flex flex-col items-center">
            <img src={item.thumbnailUrl || `https://picsum.photos/seed/${item.id}/400`} alt={item.title} className="w-full h-64 object-cover rounded-lg mb-4" />
            <audio src={item.url} controls autoPlay className="w-full" />
          </div>
        );
      default:
        return <p>Unsupported media type.</p>;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex justify-center items-center p-4 transition-opacity animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row border border-gray-700 shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors z-20"
            aria-label="Close media viewer"
        >
            <CloseIcon className="w-7 h-7" />
        </button>
        <div className="flex flex-col md:flex-row h-full">
            {/* Media Content */}
            <div className="flex-grow flex justify-center items-center bg-gray-100 dark:bg-black rounded-l-xl p-4 md:w-2/3">
                {renderMedia()}
            </div>

            {/* Info and Comments */}
            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-r-xl w-full md:w-1/3 max-h-full">
                <div className="flex-shrink-0">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    {item.description && <p className="text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>}
                </div>

                {/* Reactions Display */}
                <div className="flex items-center gap-4 mt-2">
                    {Object.entries(item.reactions)
                    // FIX: The value `userIds` from Object.entries is of type `unknown`.
                    // We must first verify it's an array before accessing its `length` property.
                    // This predicate function acts as a type guard for the subsequent .map().
                    .filter((entry): entry is [string, number[]] => Array.isArray(entry[1]) && entry[1].length > 0)
                    .map(([emoji, userIds]) => (
                    <div key={emoji} className="flex items-center gap-1.5 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                        <span className="text-lg">{emoji}</span>
                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{userIds.length}</span>
                    </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                
                {/* Comments List */}
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    {item.comments.length > 0 ? item.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-3">
                            <img src={comment.authorAvatarUrl} alt={comment.authorName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                            <div className="flex-grow bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                                <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{comment.authorName}</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-8">No comments yet. Be the first!</p>
                    )}
                </div>

                {/* Comment Form */}
                <div className="flex-shrink-0 pt-4 mt-auto">
                     <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
                        <img src={currentUser.avatarUrl} alt="Your avatar" className="w-8 h-8 rounded-full object-cover" />
                        <input
                            type="text"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full py-2 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button type="submit" className="bg-purple-600 text-white rounded-full p-2.5 hover:bg-purple-700 transition-colors flex-shrink-0">
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>

                     {/* Reaction Form */}
                    <div className="flex-shrink-0 pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-around">
                        {reactionEmojis.map(emoji => {
                            const hasReacted = item.reactions[emoji]?.includes(currentUser.id);
                            return (
                            <button
                                key={emoji}
                                onClick={() => onAddReaction(item.id, emoji)}
                                className={`text-2xl p-2 rounded-full transition-transform transform hover:scale-125 ${hasReacted ? 'bg-purple-200 dark:bg-purple-800/50' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                aria-label={`React with ${emoji}`}
                            >
                                {emoji}
                            </button>
                            )
                        })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MediaViewerModal;
