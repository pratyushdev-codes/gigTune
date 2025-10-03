import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Musician, Message } from '../types';
import { CloseIcon, SendIcon, ArrowLeftIcon } from './Icons';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  musicians: Musician[];
  currentUser: Musician;
  onSendMessage: (conversationId: string, text: string) => void;
  activeConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
}

const ConversationList: React.FC<{
    conversations: Conversation[], 
    musicians: Musician[], 
    currentUser: Musician, 
    onSelectConversation: (id: string) => void 
}> = ({ conversations, musicians, currentUser, onSelectConversation }) => {
    
    const sortedConversations = [...conversations].sort((a, b) => {
        const lastMessageA = a.messages[a.messages.length - 1];
        const lastMessageB = b.messages[b.messages.length - 1];
        if (!lastMessageA) return 1;
        if (!lastMessageB) return -1;
        return new Date(lastMessageB.timestamp).getTime() - new Date(lastMessageA.timestamp).getTime();
    });

    return (
        <div className="h-full overflow-y-auto">
            {sortedConversations.map(convo => {
                const otherParticipantId = convo.participantIds.find(id => id !== currentUser.id);
                const otherParticipant = musicians.find(m => m.id === otherParticipantId);
                const lastMessage = convo.messages[convo.messages.length - 1];

                if (!otherParticipant) return null;

                return (
                    <div 
                        key={convo.id} 
                        className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100 border-b border-gray-200"
                        onClick={() => onSelectConversation(convo.id)}
                    >
                        <img src={otherParticipant.avatarUrl} alt={otherParticipant.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-grow overflow-hidden">
                            <h4 className="font-bold text-gray-800 truncate">{otherParticipant.name}</h4>
                            <p className="text-sm text-gray-500 truncate">{lastMessage ? lastMessage.text : 'No messages yet'}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const ChatView: React.FC<{
    conversation: Conversation, 
    musicians: Musician[],
    currentUser: Musician, 
    onSendMessage: (conversationId: string, text: string) => void
}> = ({ conversation, musicians, currentUser, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const otherParticipantId = conversation.participantIds.find(id => id !== currentUser.id);
    const otherParticipant = musicians.find(m => m.id === otherParticipantId);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation.messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(conversation.id, newMessage);
            setNewMessage('');
        }
    };

    if(!otherParticipant) return <div className="p-4 text-center text-gray-500">Could not find user.</div>;

    return (
        <div className="h-full flex flex-col">
             <div className="p-3 border-b border-gray-200 flex items-center gap-3">
                 <img src={otherParticipant.avatarUrl} alt={otherParticipant.name} className="w-10 h-10 rounded-full object-cover" />
                 <h3 className="font-bold text-lg text-gray-800">{otherParticipant.name}</h3>
             </div>
            <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                {conversation.messages.map(msg => (
                    <div key={msg.id} className={`flex mb-4 ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl ${msg.senderId === currentUser.id ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                           <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-gray-100 border border-gray-300 rounded-full py-2 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button type="submit" className="bg-purple-600 text-white rounded-full p-2.5 hover:bg-purple-700 transition-colors flex-shrink-0">
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};


const ChatPanel: React.FC<ChatPanelProps> = ({ 
    isOpen, 
    onClose, 
    conversations,
    musicians,
    currentUser, 
    onSendMessage,
    activeConversationId,
    onSelectConversation
}) => {
  if (!isOpen) return null;

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="fixed inset-0 z-40">
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-black/30 animate-fade-in"
            onClick={() => {
                onClose();
                onSelectConversation(null);
            }}
        ></div>

        {/* Panel */}
        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <header className="p-3 border-b border-gray-200 flex items-center justify-between bg-white/80 backdrop-blur-sm flex-shrink-0">
                {activeConversationId && (
                    <button 
                        onClick={() => onSelectConversation(null)}
                        className="p-2 rounded-full hover:bg-gray-200"
                        aria-label="Back to conversations"
                    >
                        <ArrowLeftIcon className="w-6 h-6 text-gray-700"/>
                    </button>
                )}
                <h2 className="text-xl font-bold text-gray-800">{activeConversationId ? "Chat" : "Messages"}</h2>
                <button 
                    onClick={() => {
                        onClose();
                        onSelectConversation(null);
                    }}
                    className="p-2 rounded-full hover:bg-gray-200"
                    aria-label="Close chat panel"
                >
                    <CloseIcon className="w-6 h-6 text-gray-700" />
                </button>
            </header>
            <main className="flex-grow overflow-hidden">
                {activeConversation ? (
                    <ChatView
                        conversation={activeConversation}
                        musicians={musicians}
                        currentUser={currentUser}
                        onSendMessage={onSendMessage}
                    />
                ) : (
                    <ConversationList
                        conversations={conversations}
                        musicians={musicians}
                        currentUser={currentUser}
                        onSelectConversation={onSelectConversation}
                    />
                )}
            </main>
        </div>
    </div>
  );
};

export default ChatPanel;
