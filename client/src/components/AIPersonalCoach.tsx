'use client';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';
import { MessageCircle, Send, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIPersonalCoach() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialGreeting, setInitialGreeting] = useState('');

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      generateGreeting();
    }
  }, [isOpen]);

  const generateGreeting = async () => {
    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();
      
      const response = await fetch(`${apiUrl}/api/ai/motivation`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goalsCompleted: 5,
          habitsTracked: 12,
          streak: 7,
          recentAchievements: ['Completed assessment', 'Added goal']
        })
      });

      if (response.ok) {
        const result = await response.json();
        const greeting = result.insights?.tips?.[0] || 'Welcome! How can I help you today?';
        setInitialGreeting(greeting);
        setMessages([{
          id: '1',
          role: 'assistant',
          content: greeting,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Failed to generate greeting:', error);
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Welcome to your AI Personal Coach! How can I help you today?',
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: 'personal-development'
        })
      });

      if (response.ok) {
        const result = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response || 'I\'m here to help! Tell me more about what you need.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m temporarily unavailable. Please try again later.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all flex items-center justify-center group z-40"
        title="Open AI Personal Coach"
      >
        <MessageCircle size={24} />
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-96'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-bold">AI Personal Coach</h3>
            <p className="text-xs opacity-90">Always here for you</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="bg-white dark:bg-gray-900 flex-1 overflow-y-auto p-4 space-y-4 h-80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 p-3 rounded-b-2xl flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:border-purple-500 text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
