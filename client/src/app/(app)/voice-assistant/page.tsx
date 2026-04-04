'use client';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { Mic, MicOff, Send, Volume2, VolumeX, Settings, Home, HelpCircle } from 'lucide-react';

interface VoiceCommand {
  command: string;
  description: string;
  examples: string[];
  category: string;
}

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCommandList, setShowCommandList] = useState(true);
  const [volume, setVolume] = useState(1);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const commands: VoiceCommand[] = [
    // Dashboard & Overview
    { command: 'show dashboard', description: 'Display your dashboard overview', examples: ['show dashboard', 'open dashboard'], category: 'Dashboard' },
    { command: 'how am i doing', description: 'Get your current status summary', examples: ['how am i doing', 'show my status'], category: 'Dashboard' },
    { command: 'show my stats', description: 'Display your statistics', examples: ['show my stats', 'tell me my stats'], category: 'Dashboard' },

    // Goals
    { command: 'add goal', description: 'Add a new goal', examples: ['add a goal', 'create new goal', 'i want to add a goal'], category: 'Goals' },
    { command: 'show goals', description: 'List all active goals', examples: ['show my goals', 'list goals', 'what are my goals'], category: 'Goals' },
    { command: 'complete goal', description: 'Mark a goal as complete', examples: ['complete my goal', 'finish goal'], category: 'Goals' },

    // Habits
    { command: 'add habit', description: 'Create a new habit to track', examples: ['add a habit', 'create new habit', 'track new habit'], category: 'Habits' },
    { command: 'show habits', description: 'List all your habits', examples: ['show habits', 'what are my habits', 'list my habits'], category: 'Habits' },
    { command: 'check in habit', description: 'Mark a habit as done today', examples: ['check in my habit', 'complete habit', 'mark habit done'], category: 'Habits' },
    { command: 'my streak', description: 'Show your habit streaks', examples: ['show my streak', 'how many days streak', 'my streaks'], category: 'Habits' },

    // Journal
    { command: 'journal entry', description: 'Start a new journal entry', examples: ['add journal entry', 'journal', 'write journal'], category: 'Journal' },
    { command: 'show journal', description: 'Display recent journal entries', examples: ['show my journal', 'recent journals', 'latest entries'], category: 'Journal' },
    { command: 'journal prompt', description: 'Get a writing prompt', examples: ['give me a prompt', 'journal prompt', 'writing prompt'], category: 'Journal' },

    // Motivation
    { command: 'daily quote', description: 'Get today\'s motivational quote', examples: ['quote', 'motivational quote', 'inspire me'], category: 'Motivation' },
    { command: 'show challenge', description: 'Show your 100-day challenge progress', examples: ['show challenge', '100 day challenge', 'my progress'], category: 'Motivation' },
    { command: 'next quote day', description: 'Move to next day\'s quote', examples: ['next quote', 'tomorrow\'s quote'], category: 'Motivation' },

    // Daily Routine
    { command: 'add routine', description: 'Add activity to daily routine', examples: ['add routine', 'add to schedule', 'schedule activity'], category: 'Daily Routine' },
    { command: 'show routine', description: 'Display today\'s routine', examples: ['show routine', 'what\'s today\'s schedule', 'my schedule'], category: 'Daily Routine' },

    // Money Management
    { command: 'add income', description: 'Record income entry', examples: ['add income', 'i earned money', 'add salary'], category: 'Money' },
    { command: 'add expense', description: 'Record expense entry', examples: ['add expense', 'spent money', 'add spending'], category: 'Money' },
    { command: 'show finances', description: 'Display financial summary', examples: ['show finances', 'financial overview', 'my money'], category: 'Money' },
    { command: 'net worth', description: 'Show your net worth', examples: ['net worth', 'show net worth', 'how much money i have'], category: 'Money' },

    // Skills
    { command: 'add skill', description: 'Add a new skill to track', examples: ['add skill', 'new skill', 'track skill'], category: 'Skills' },
    { command: 'show skills', description: 'List all your skills', examples: ['show skills', 'my skills', 'what skills i have'], category: 'Skills' },

    // Help & General
    { command: 'help', description: 'Show all available commands', examples: ['help', 'show commands', 'what can you do'], category: 'Help' },
    { command: 'hello', description: 'Greeting and intro', examples: ['hello', 'hi', 'hey', 'good morning'], category: 'Help' },
    { command: 'what time', description: 'Tell current time', examples: ['what time', 'current time', 'what\'s the time'], category: 'Help' },
    { command: 'profile', description: 'Show your profile', examples: ['show profile', 'my profile'], category: 'Profile' },
  ];

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setResponse('Speech Recognition not supported in your browser. Please use Chrome, Edge, or Firefox.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          interim += transcriptSegment + ' ';
        } else {
          interim += transcriptSegment;
        }
      }
      setTranscript(interim);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript.trim()) {
        processCommand(transcript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setResponse(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  };

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    synthRef.current = utterance;
  };

  const processCommand = async (input: string) => {
    const lowerInput = input.toLowerCase();
    let responseText = '';

    try {
      // Dashboard commands
      if (lowerInput.includes('dashboard') || lowerInput.includes('overview')) {
        const data = await api.getDashboard?.();
        responseText = `Welcome back! You have ${data?.stats?.activeGoals || 0} active goals, ${data?.stats?.totalHabits || 0} habits tracked, and your level is ${data?.profile?.level || 1}. You're making great progress!`;
      }

      // Greeting
      else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        responseText = `Hello! I'm your PersonaForge Voice Assistant. I can help you with goals, habits, journal entries, finances, motivation, and more. Say 'help' to hear all available commands.`;
      }

      // Help
      else if (lowerInput.includes('help') || lowerInput.includes('commands')) {
        responseText = `I can help with: Goals and tracking, Daily habits and routines, Journal writing, Money management, Motivation and quotes, Motivation daily challenge, Skills tracking, and more. Which area interests you?`;
      }

      // Time
      else if (lowerInput.includes('time')) {
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        responseText = `The current time is ${now}.`;
      }

      // Goals
      else if (lowerInput.includes('show goal') || lowerInput.includes('list goal')) {
        const goals = await api.getGoals?.();
        const count = goals?.length || 0;
        responseText = count > 0 ? `You have ${count} active goals. Great commitment to your growth!` : 'You don\'t have any goals yet. Would you like to add one?';
      }

      // Habits
      else if (lowerInput.includes('show habit') || lowerInput.includes('list habit')) {
        const habits = await api.getHabits?.();
        const count = habits?.length || 0;
        responseText = count > 0 ? `You're tracking ${count} habits. Keep up the consistency!` : 'No habits tracked yet. Let\'s build some positive habits!';
      }

      // Motivation - Quote
      else if (lowerInput.includes('quote') || lowerInput.includes('inspire')) {
        const quoteData = await api.getDailyQuote?.(1);
        responseText = quoteData?.quote || 'You are capable of amazing things. Keep pushing forward!';
      }

      // Money - Net Worth
      else if (lowerInput.includes('net worth') || lowerInput.includes('assets')) {
        const moneyData = await api.getMoneyManagement?.();
        const assets = moneyData?.entries?.filter((e: any) => e.type === 'asset').reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
        const liabilities = moneyData?.entries?.filter((e: any) => e.type === 'liability').reduce((sum: number, e: any) => sum + e.amount, 0) || 0;
        const netWorth = assets - liabilities;
        responseText = `Your net worth is $${netWorth.toFixed(2)}. You have $${assets.toFixed(2)} in assets and $${liabilities.toFixed(2)} in liabilities.`;
      }

      // Money - Income
      else if (lowerInput.includes('add income') || lowerInput.includes('earned')) {
        responseText = 'To add income, please say the amount and source. For example, "add 5000 dollars salary"';
      }

      // Money - Expenses
      else if (lowerInput.includes('add expense') || lowerInput.includes('spent')) {
        responseText = 'To add an expense, please say the amount and category. For example, "add 50 dollars food"';
      }

      // Motivation Challenge
      else if (lowerInput.includes('challenge') || lowerInput.includes('100 day')) {
        const challenge = await api.get100DayChallenge?.();
        const completed = challenge?.dailyChallenges?.filter((c: any) => c.completed).length || 0;
        responseText = `You've completed ${completed} out of 100 days! You're ${Math.round((completed / 100) * 100)}% through your self-love journey. Keep going!`;
      }

      // Profile
      else if (lowerInput.includes('profile') || lowerInput.includes('about me')) {
        const profile = await api.getProfile?.();
        responseText = `Your profile shows you're ${profile?.display_name || 'User'}, and you're level ${profile?.level || 1} with amazing progress in your personal growth.`;
      }

      // Default response
      else {
        responseText = `I heard "${input}". I'm not sure about that command. Say 'help' to hear what I can do.`;
      }
    } catch (error: any) {
      responseText = `I encountered an issue processing that request. Please try again. Error: ${error.message}`;
    }

    // Add to conversation history
    setConversationHistory([
      ...conversationHistory,
      { type: 'user', text: input },
      { type: 'assistant', text: responseText },
    ]);

    setResponse(responseText);
    speak(responseText);
  };

  const handleManualInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = transcript || '';
    if (input.trim()) {
      processCommand(input);
      setTranscript('');
    }
  };

  const categoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Dashboard': 'bg-blue-100 dark:bg-blue-900 text-blue-700',
      'Goals': 'bg-purple-100 dark:bg-purple-900 text-purple-700',
      'Habits': 'bg-green-100 dark:bg-green-900 text-green-700',
      'Journal': 'bg-pink-100 dark:bg-pink-900 text-pink-700',
      'Motivation': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700',
      'Daily Routine': 'bg-orange-100 dark:bg-orange-900 text-orange-700',
      'Money': 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700',
      'Skills': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700',
      'Profile': 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700',
      'Help': 'bg-gray-100 dark:bg-gray-700 text-gray-700',
    };
    return colors[category] || 'bg-gray-100 dark:bg-gray-700';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Mic className="text-brand-600" size={36} /> Voice Assistant
        </h1>
        <p className="text-gray-500 mt-1">Talk to PersonaForge - your personal AI assistant</p>
      </div>

      {/* Voice Control Panel */}
      <div className="card p-8 mb-8">
        <div className="flex flex-col items-center gap-6">
          {/* Microphone Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg'
            }`}
          >
            {isListening ? <MicOff size={40} /> : <Mic size={40} />}
          </button>

          {/* Status */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              {isListening ? 'Listening...' : 'Click microphone to talk'}
            </p>
            {transcript && <p className="text-lg font-semibold italic">{transcript}</p>}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-4 w-full max-w-xs">
            <VolumeX size={20} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              className="w-full"
            />
            <Volume2 size={20} />
          </div>
        </div>
      </div>

      {/* Response Display */}
      {response && (
        <div className="card p-6 mb-8 border-l-4 border-brand-600">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Assistant Response</p>
              <p className="text-lg text-gray-800 dark:text-gray-200">{response}</p>
            </div>
            <button
              onClick={() => speak(response)}
              disabled={isSpeaking}
              className="ml-4 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Volume2 size={16} /> {isSpeaking ? 'Speaking...' : 'Repeat'}
            </button>
          </div>
        </div>
      )}

      {/* Manual Input */}
      <form onSubmit={handleManualInput} className="card p-4 mb-8 flex gap-2">
        <input
          type="text"
          value={transcript}
          onChange={e => setTranscript(e.target.value)}
          placeholder="Type a command or click the microphone..."
          className="input flex-1"
        />
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Send size={18} /> Send
        </button>
      </form>

      {/* Command List Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setShowCommandList(!showCommandList)}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
            showCommandList
              ? 'bg-brand-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          }`}
        >
          <HelpCircle size={18} /> {showCommandList ? 'Hide' : 'Show'} Commands
        </button>
      </div>

      {/* Available Commands */}
      {showCommandList && (
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings size={24} /> Available Commands
          </h2>

          {/* Commands by Category */}
          {Array.from(new Set(commands.map(c => c.category))).map(category => (
            <div key={category} className="mb-8">
              <h3 className={`text-lg font-semibold mb-4 px-3 py-1 rounded-lg inline-block ${categoryColor(category)}`}>
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commands
                  .filter(c => c.category === category)
                  .map((cmd, idx) => (
                    <div key={idx} className="p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all" onClick={() => setTranscript(cmd.command)}>
                      <p className="font-semibold text-brand-600 mb-1">"{cmd.command}"</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{cmd.description}</p>
                      <div className="text-xs text-gray-500">
                        <strong>Try:</strong> {cmd.examples.join(' • ')}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conversation History */}
      {conversationHistory.length > 0 && (
        <div className="card p-6 mt-8">
          <h3 className="text-lg font-bold mb-4">Conversation History</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversationHistory.map((msg, idx) => (
              <div key={idx} className={`p-4 rounded-lg ${msg.type === 'user' ? 'bg-brand-100 dark:bg-brand-900/30 ml-8' : 'bg-gray-100 dark:bg-gray-800 mr-8'}`}>
                <p className={`text-sm font-semibold mb-1 ${msg.type === 'user' ? 'text-brand-700' : 'text-gray-700 dark:text-gray-300'}`}>
                  {msg.type === 'user' ? 'You' : 'Assistant'}
                </p>
                <p className="text-gray-800 dark:text-gray-200">{msg.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
