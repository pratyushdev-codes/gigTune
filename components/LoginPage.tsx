import React, { useState } from 'react';
import { MusicNoteIcon } from './Icons';
import { Musician, Instrument } from '../types';
import { ALL_INSTRUMENTS } from '../constants';

export interface NewProfileData {
    name: string;
    email: string;
    location: string;
    instrument: Instrument;
}

interface LoginPageProps {
  onLogin: (email: string) => Musician | null;
  onLoginSuccess: (user: Musician) => void;
  onCreateProfile: (data: NewProfileData) => Promise<void>;
}

// FIX: Extracted props to a named interface for better readability and to avoid potential type inference issues with inline types.
interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

// Moved TabButton outside of the LoginPage component to prevent re-rendering issues
const TabButton = ({
    active,
    onClick,
    children
}: TabButtonProps) => (
    <button
        onClick={onClick}
        className={`w-1/2 py-3 font-bold text-lg transition-colors focus:outline-none ${
        active
            ? 'text-purple-600 border-b-2 border-purple-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
    >
        {children}
    </button>
);

// Moved InputField outside of the LoginPage component to prevent re-rendering issues
const InputField = ({ 
    id, 
    label, 
    type, 
    value, 
    onChange, 
    placeholder, 
    required = true 
}: {
    id: string,
    label: string,
    type: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    required?: boolean
}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input 
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-100 border border-gray-300 rounded-md py-2.5 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            required={required}
        />
    </div>
);


const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onLoginSuccess, onCreateProfile }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupLocation, setSignupLocation] = useState('');
  const [signupInstrument, setSignupInstrument] = useState<Instrument>(Instrument.GUITAR);
  const [signupError, setSignupError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all fields.');
      return;
    }
    const user = onLogin(loginEmail);
    if (user) {
      // Password check is omitted for this demo
      onLoginSuccess(user);
    } else {
      setLoginError('No account found with that email.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!signupName || !signupEmail || !signupPassword || !signupLocation) {
        setSignupError('Please fill in all fields.');
        return;
    }

    try {
        await onCreateProfile({
            name: signupName,
            email: signupEmail,
            location: signupLocation,
            instrument: signupInstrument
        });
    } catch (err: any) {
        setSignupError(err.message || 'An unknown error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mx-auto animate-fade-in">
        <div className="text-center mb-8">
            <div className="inline-block bg-purple-100 p-3 rounded-full mb-4 border border-purple-200">
            <MusicNoteIcon className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
            Gig<span className="text-purple-600">Tune</span>
            </h1>
        </div>

        <div className="bg-white/70 border border-gray-200 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
                {/* FIX: The TabButton component requires children for its label. Added "Log In". */}
                <TabButton active={activeTab === 'login'} onClick={() => setActiveTab('login')}>Log In</TabButton>
                {/* FIX: The TabButton component requires children for its label. Added "Create Profile". */}
                <TabButton active={activeTab === 'signup'} onClick={() => setActiveTab('signup')}>Create Profile</TabButton>
            </div>
            
            <div className="p-8">
                {activeTab === 'login' ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <InputField id="login-email" label="Email" type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="you@example.com" />
                        <InputField id="login-password" label="Password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" />
                        {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                        <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50">
                            Log In
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSignupSubmit} className="space-y-4">
                        <InputField id="signup-name" label="Full Name" type="text" value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="Alex Rivera" />
                        <InputField id="signup-email" label="Email" type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="alex.rivera@gigtune.com" />
                        <InputField id="signup-password" label="Password" type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} placeholder="Create a password" />
                        <InputField id="signup-location" label="Location" type="text" value={signupLocation} onChange={e => setSignupLocation(e.target.value)} placeholder="New York, NY" />
                        
                        <div>
                            <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 mb-1">Primary Instrument</label>
                            <select 
                                id="instrument"
                                value={signupInstrument}
                                onChange={e => setSignupInstrument(e.target.value as Instrument)}
                                className="w-full bg-gray-100 border border-gray-300 rounded-md py-2.5 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            >
                                {ALL_INSTRUMENTS.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                            </select>
                        </div>

                        {signupError && <p className="text-red-500 text-sm">{signupError}</p>}

                        <div className="pt-2">
                             <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500/50">
                                Create Account
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;