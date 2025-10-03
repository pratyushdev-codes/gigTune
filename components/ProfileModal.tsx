import React, { useState, useEffect, useRef } from 'react';
import { Musician, Genre, Instrument, PortfolioItem, Review, PortfolioItemType } from '../types';
import { LocationPinIcon, StarIcon, CloseIcon, MailIcon, PencilIcon, ChatIcon, PlayIcon, AudioIcon, VideoIcon, ImageFileIcon, UploadIcon, StarOutlineIcon, CameraIcon, UserPlusIcon, VerifiedIcon } from './Icons';
import { ALL_INSTRUMENTS, ALL_GENRES } from '../constants';

interface ProfileModalProps {
  musician: Musician | null;
  onClose: () => void;
  currentUser: Musician | null;
  onUpdateProfile: (updatedProfile: Musician) => Promise<void>;
  onStartChat: (musician: Musician) => void;
  onViewMedia: (item: PortfolioItem) => void;
  onOpenUploadModal: () => void;
  onAddReview: (musicianId: number, rating: number, comment: string) => void;
  onFollowToggle: (targetMusicianId: number) => void;
}

const StarRatingInput = ({ rating, setRating }: { rating: number; setRating: (r: number) => void }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-yellow-400 hover:text-yellow-500 transition-transform transform hover:scale-110 focus:outline-none"
            >
                {star <= rating ? <StarIcon className="w-7 h-7" /> : <StarOutlineIcon className="w-7 h-7" />}
            </button>
        ))}
    </div>
);

const ReviewForm = ({ musician, currentUser, onAddReview }: { musician: Musician, currentUser: Musician, onAddReview: ProfileModalProps['onAddReview'] }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const hasAlreadyReviewed = musician.reviews.some(r => r.reviewerId === currentUser.id);
    if (hasAlreadyReviewed) {
        return <p className="text-sm text-center bg-gray-100 dark:bg-gray-700 p-3 rounded-md">You've already reviewed {musician.name.split(' ')[0]}.</p>
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (!comment.trim()) {
            setError('Please enter a comment.');
            return;
        }
        onAddReview(musician.id, rating, comment);
        setRating(0);
        setComment('');
        setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 mt-6 space-y-4">
            <h4 className="font-bold text-lg text-gray-800 dark:text-white">Leave a Review</h4>
            <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Your Rating</label>
                <StarRatingInput rating={rating} setRating={setRating} />
            </div>
             <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Your Comment</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder={`Share your experience working with ${musician.name.split(' ')[0]}...`}
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="bg-purple-600 text-white font-semibold py-2 px-5 rounded-full hover:bg-purple-700 transition-colors">
                Submit Review
            </button>
        </form>
    );
}

const ProfileModal: React.FC<ProfileModalProps> = ({ musician, onClose, currentUser, onUpdateProfile, onStartChat, onViewMedia, onOpenUploadModal, onAddReview, onFollowToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Musician | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('about');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (musician) {
      // Deep copy to prevent mutating the prop object during edits
      setEditedProfile(JSON.parse(JSON.stringify(musician)));
    } else {
      setEditedProfile(null);
    }
    // When a new musician is selected, always exit edit mode
    setIsEditing(false);
    setActiveTab('about');
  }, [musician]);

  if (!musician || !currentUser || !editedProfile) return null;

  const isOwnProfile = currentUser.id === musician.id;
  const isFollowing = currentUser.following.includes(musician.id);

  const handleSave = async () => {
    if (editedProfile) {
       const finalProfile = {
        ...editedProfile,
        expertise: Array.isArray(editedProfile.expertise) 
            ? editedProfile.expertise.map(e => String(e).trim()).filter(Boolean)
            : []
      };
      // Let the parent handle the update. The useEffect will then reset the state.
      await onUpdateProfile(finalProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset state from original musician prop using a deep copy
    if (musician) {
      setEditedProfile(JSON.parse(JSON.stringify(musician)));
    }
    setIsEditing(false);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditedProfile(prev => prev ? { ...prev, avatarUrl: reader.result as string } : null);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleGenresChange = (genre: Genre) => {
    setEditedProfile(prev => {
        if (!prev) return null;
        const currentGenres = prev.genres;
        const newGenres = currentGenres.includes(genre)
            ? currentGenres.filter(g => g !== genre)
            : [...currentGenres, genre];
        return { ...prev, genres: newGenres };
    });
  };

  const handleExpertiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const skills = e.target.value.split(',').map(s => s.trimStart());
      setEditedProfile(prev => prev ? { ...prev, expertise: skills } : null);
  };

  const TabButton = ({ tabName, label }: { tabName: typeof activeTab, label: string}) => (
      <button
          onClick={() => setActiveTab(tabName)}
          className={`px-4 py-2 font-semibold text-sm rounded-full transition-colors ${activeTab === tabName ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
      >
          {label}
      </button>
  );

  const averageRating = musician.reviews.length > 0
    ? musician.reviews.reduce((acc, review) => acc + review.rating, 0) / musician.reviews.length
    : 0;

  const renderAboutView = () => (
    <div className="space-y-6 animate-fade-in">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-center sm:text-left">{musician.bio}</p>
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-3">
                {musician.expertise.map(skill => (
                <span key={skill} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full font-medium">{skill}</span>
                ))}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">Genres</h3>
            <div className="flex flex-wrap gap-3">
                {musician.genres.map(genre => (
                <span key={genre} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full font-medium">{genre}</span>
                ))}
            </div>
        </div>
    </div>
  );

  const renderPortfolioView = () => (
    <div className="animate-fade-in">
        {isOwnProfile && (
            <div className="text-right mb-4">
                <button 
                    onClick={onOpenUploadModal}
                    className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-purple-700 transition-colors">
                    <UploadIcon className="w-5 h-5" />
                    Add to Portfolio
                </button>
            </div>
        )}
        {musician.portfolio.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {musician.portfolio.map(item => (
                    <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer border border-gray-200 dark:border-gray-700" onClick={() => onViewMedia(item)}>
                        <img src={item.thumbnailUrl || (item.type === 'Image' ? item.url : `https://picsum.photos/seed/${item.id}/400`)} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                             <div className="relative z-10 text-white">
                                {item.type === 'Video' && <VideoIcon className="w-8 h-8 mb-2" />}
                                {item.type === 'Audio' && <AudioIcon className="w-8 h-8 mb-2" />}
                                {item.type === 'Image' && <ImageFileIcon className="w-8 h-8 mb-2" />}
                                <h4 className="font-bold">{item.title}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">{isOwnProfile ? "You haven't added any portfolio items yet." : `${musician.name.split(' ')[0]} hasn't added any portfolio items yet.`}</p>
            </div>
        )}
    </div>
  );

  const renderReviewsView = () => (
    <div className="animate-fade-in">
        {musician.reviews.length > 0 ? (
            <div className="space-y-6">
                {musician.reviews.map(review => (
                    <div key={review.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <img src={review.reviewerAvatarUrl} alt={review.reviewerName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200">{review.reviewerName}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />)}
                                </div>
                            </div>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">No reviews yet for {musician.name.split(' ')[0]}.</p>
            </div>
        )}
        {!isOwnProfile && <ReviewForm musician={musician} currentUser={currentUser} onAddReview={onAddReview} />}
    </div>
  );

  const renderEditView = () => (
    <div className="p-8 pt-20 sm:pt-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h2>
        <div className="space-y-6 max-h-[calc(90vh-250px)] sm:max-h-[calc(90vh-200px)] overflow-y-auto pr-4">
             <div className="flex justify-center">
                <div className="relative group">
                    <img src={editedProfile.avatarUrl} alt={editedProfile.name} className="w-32 h-32 rounded-full border-4 border-purple-200 object-cover" />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Change profile picture"
                    >
                        <CameraIcon className="w-8 h-8" />
                    </button>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/gif"
                />
            </div>
            <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input id="name" name="name" type="text" value={editedProfile.name} onChange={handleFieldChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input id="location" name="location" type="text" value={editedProfile.location} onChange={handleFieldChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div>
                <label htmlFor="instrument" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Primary Instrument</label>
                <select id="instrument" name="instrument" value={editedProfile.instrument} onChange={handleFieldChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {ALL_INSTRUMENTS.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="bio" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea id="bio" name="bio" rows={4} value={editedProfile.bio} onChange={handleFieldChange} className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Genres</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ALL_GENRES.map(genre => (
                        <label key={genre} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50">
                            <input type="checkbox" checked={editedProfile.genres.includes(genre)} onChange={() => handleGenresChange(genre)} className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900"/>
                            <span className="text-gray-800 dark:text-gray-200">{genre}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label htmlFor="expertise" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Expertise</label>
                <input id="expertise" name="expertise" type="text" value={Array.isArray(editedProfile.expertise) ? editedProfile.expertise.join(', ') : ''} onChange={handleExpertiseChange} placeholder="e.g. Live Performance, Studio Recording" className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separate skills with a comma.</p>
            </div>
        </div>
    </div>
  );

  const renderProfileView = () => (
    <div className="p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6">
            <img src={musician.avatarUrl} alt={musician.name} className="w-32 h-32 rounded-full border-4 border-purple-500 object-cover flex-shrink-0" />
            <div className="text-center sm:text-left flex-grow">
                 <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{musician.name}</h2>
                    {/* FIX: The `VerifiedIcon` component does not accept a `title` prop. To preserve the tooltip functionality, the icon is wrapped in a `span` and the `title` attribute is moved to the span. */}
                    {musician.isVerified && <span title="Verified Musician"><VerifiedIcon className="w-6 h-6 text-blue-500"/></span>}
                </div>
                <p className="text-xl text-purple-500 font-semibold mt-1">{musician.instrument}</p>
                 <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                        <LocationPinIcon className="w-5 h-5 mr-1.5" />
                        <span>{musician.location}</span>
                    </div>
                    {averageRating > 0 && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <StarIcon className="w-5 h-5 mr-1 text-yellow-400" />
                            <span className="font-bold">{averageRating.toFixed(1)}</span>
                        </div>
                    )}
                 </div>
                 <div className="flex items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <div><span className="font-semibold">{musician.followers.length}</span> Followers</div>
                    <div><span className="font-semibold">{musician.following.length}</span> Following</div>
                 </div>
            </div>
            {!isOwnProfile && (
                <div className="flex-shrink-0 mt-4 sm:mt-0 flex flex-col sm:flex-row items-center gap-3">
                    <button 
                        onClick={() => onFollowToggle(musician.id)}
                        className={`inline-flex items-center gap-2 font-bold py-2 px-5 rounded-full transition-colors w-32 justify-center ${
                            isFollowing 
                                ? 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500' 
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}>
                        <UserPlusIcon className="w-5 h-5" />
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                     <button 
                        onClick={() => onStartChat(musician)}
                        className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-2 px-5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600 w-32 justify-center">
                        <ChatIcon className="w-5 h-5" />
                        Message
                    </button>
                </div>
            )}
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-full">
                <TabButton tabName="about" label="About" />
                <TabButton tabName="portfolio" label={`Portfolio (${musician.portfolio.length})`} />
                <TabButton tabName="reviews" label={`Reviews (${musician.reviews.length})`} />
            </div>
        </div>

        <div className="max-h-[40vh] overflow-y-auto pr-4">
            {activeTab === 'about' && renderAboutView()}
            {activeTab === 'portfolio' && renderPortfolioView()}
            {activeTab === 'reviews' && renderReviewsView()}
        </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 shadow-2xl relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-20"
          aria-label="Close profile"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        {isOwnProfile && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 border border-gray-300 dark:border-gray-600 shadow-sm"
                  aria-label="Edit profile"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
        )}
        
        {isEditing ? renderEditView() : renderProfileView()}
      </div>
    </div>
  );
};

export default ProfileModal;
