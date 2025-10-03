import React, { useState, useCallback } from 'react';
import { PortfolioItem, PortfolioItemType } from '../types';
import { CloseIcon, UploadIcon, SparklesIcon, ImageFileIcon } from './Icons';
import { GoogleGenAI } from '@google/genai';

interface UploadPortfolioModalProps {
  onClose: () => void;
  onAddItem: (item: Omit<PortfolioItem, 'id' | 'reactions'>) => void;
}

const UploadPortfolioModal: React.FC<UploadPortfolioModalProps> = ({ onClose, onAddItem }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<PortfolioItemType | null>(null);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThumbnailUrl, setGeneratedThumbnailUrl] = useState<string | null>(null);


  const handleFileChange = (selectedFile: File | null) => {
    setError('');
    if (!selectedFile) return;

    const type = selectedFile.type;
    let itemType: PortfolioItemType | null = null;
    
    if (type.startsWith('image/')) itemType = PortfolioItemType.IMAGE;
    else if (type.startsWith('video/')) itemType = PortfolioItemType.VIDEO;
    else if (type.startsWith('audio/')) itemType = PortfolioItemType.AUDIO;
    
    if (!itemType) {
        setError('Unsupported file type. Please upload an image, video, or audio file.');
        return;
    }

    setFile(selectedFile);
    setFileType(itemType);
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !fileType) {
      setError('Please select a file to upload.');
      return;
    }
    if (!title.trim()) {
      setError('Please provide a title for your portfolio item.');
      return;
    }

    const newItem = {
      type: fileType,
      url: URL.createObjectURL(file), // Mock URL for demonstration
      title,
      description,
      thumbnailUrl: generatedThumbnailUrl || (fileType !== PortfolioItemType.IMAGE ? `https://picsum.photos/seed/${Date.now()}/400` : undefined),
      comments: [],
    };
    onAddItem(newItem);
  };

  const handleSuggestTags = async () => {
    if (!title) {
        setError('Please enter a title first to get suggestions.');
        return;
    }
    setError('');
    setIsSuggesting(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on the title "${title}", suggest a short, one-sentence description for this piece of music. Include a few relevant genre or mood tags at the end. For example: "An upbeat funk track with a driving bassline. Tags: #funk #groovy #instrumental"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        setDescription(response.text);
    } catch (e) {
        console.error(e);
        setError('Could not get AI suggestions. Please try again.');
    } finally {
        setIsSuggesting(false);
    }
  };
  
  const handleGenerateThumbnail = async () => {
    if (!title) {
        setError('Please enter a title to generate a thumbnail.');
        return;
    }
    setError('');
    setIsGenerating(true);
    setGeneratedThumbnailUrl(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Create a visually striking, abstract, synthwave-style album cover for a piece of music. The title is "${title}". The description is: "${description}". The artwork should be vibrant, with neon colors, and evoke a sense of creative energy. Do not include any text in the image.`;
        
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        setGeneratedThumbnailUrl(imageUrl);
    } catch (e) {
        console.error(e);
        setError('AI thumbnail generation failed. Please try again or upload your own.');
    } finally {
        setIsGenerating(false);
    }
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add Portfolio Item</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 dark:hover:text-white" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="file-upload"
              onDragEnter={onDragEnter}
              onDragOver={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`flex justify-center w-full h-32 px-4 transition bg-white dark:bg-gray-700/50 border-2 ${isDragging ? 'border-purple-500' : 'border-gray-300 dark:border-gray-600'} border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none`}
            >
              <span className="flex items-center space-x-2">
                <UploadIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {file ? `${file.name}` : 'Drop files to Attach, or '}
                  <span className={file ? 'hidden' : 'text-purple-600 underline'}>browse</span>
                </span>
              </span>
              <input id="file-upload" type="file" name="file_upload" className="hidden" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} accept="image/*,video/*,audio/*"/>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supports: JPG, PNG, MP4, MKV, MP3.</p>
          </div>
          
          {(fileType === PortfolioItemType.AUDIO || fileType === PortfolioItemType.VIDEO) && (
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Thumbnail</label>
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
                        {generatedThumbnailUrl ? (
                            <img src={generatedThumbnailUrl} alt="AI Generated Thumbnail" className="w-full h-full object-cover" />
                        ) : (
                            <ImageFileIcon className="w-10 h-10 text-gray-400" />
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleGenerateThumbnail}
                        disabled={isGenerating}
                        className="flex items-center gap-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600 shadow-sm disabled:opacity-50 disabled:cursor-wait"
                    >
                        <SparklesIcon className="w-5 h-5 text-purple-500" />
                        {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Generate a unique thumbnail for your audio/video using AI.</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="e.g., Live Solo at The Blue Note"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (Optional)</label>
                {fileType === 'Audio' && (
                     <button
                        type="button"
                        onClick={handleSuggestTags}
                        disabled={isSuggesting}
                        className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-800 disabled:opacity-50 disabled:cursor-wait"
                    >
                        <SparklesIcon className="w-4 h-4" />
                        {isSuggesting ? 'Thinking...' : 'AI-Suggest'}
                    </button>
                )}
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="A brief description of this performance or piece."
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <div className="pt-2 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-2 px-6 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-6 rounded-full hover:bg-purple-700 transition-colors">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPortfolioModal;