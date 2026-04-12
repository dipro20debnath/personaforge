'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, X, ChevronRight } from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: 'skill' | 'goal' | 'habit' | 'learning';
  priority: 'high' | 'medium' | 'low';
  action: () => void;
}

interface AIQuickSuggestionsProps {
  context?: 'goals' | 'skills' | 'habits' | 'learning' | 'dashboard';
  userProfile?: any;
}

export function AIQuickSuggestions({ context = 'dashboard', userProfile }: AIQuickSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    generateSuggestions();
  }, [context]);

  const generateSuggestions = () => {
    const contextSuggestions: Record<string, Suggestion[]> = {
      goals: [
        {
          id: '1',
          title: 'Break Down Your Goal',
          description: 'Large goals are easier to achieve when broken into smaller milestones.',
          type: 'goal',
          priority: 'high',
          action: () => console.log('Add milestones')
        },
        {
          id: '2',
          title: 'Set a Deadline',
          description: 'Goals with specific deadlines are 42% more likely to be achieved.',
          type: 'goal',
          priority: 'high',
          action: () => console.log('Set deadline')
        }
      ],
      skills: [
        {
          id: '3',
          title: 'Practice Regularly',
          description: 'Skill building requires consistent practice. Consider adding a daily practice habit.',
          type: 'habit',
          priority: 'high',
          action: () => console.log('Add practice habit')
        },
        {
          id: '4',
          title: 'Find a Mentor',
          description: 'Learning from experienced professionals accelerates skill development.',
          type: 'skill',
          priority: 'medium',
          action: () => console.log('Find mentor')
        }
      ],
      habits: [
        {
          id: '5',
          title: 'Start Small',
          description: '2-minute habits are easier to stick to. You can always increase later.',
          type: 'habit',
          priority: 'high',
          action: () => console.log('Adjust habit')
        },
        {
          id: '6',
          title: 'Track Daily',
          description: 'Visual tracking increases habit success rate by 33%.',
          type: 'habit',
          priority: 'medium',
          action: () => console.log('Enable tracking')
        }
      ],
      learning: [
        {
          id: '7',
          title: 'Mix Learning Methods',
          description: 'Combine videos, reading, and practice for faster mastery.',
          type: 'learning',
          priority: 'medium',
          action: () => console.log('Add resources')
        },
        {
          id: '8',
          title: 'Teach What You Learn',
          description: 'Teaching others reinforces your learning and builds confidence.',
          type: 'learning',
          priority: 'medium',
          action: () => console.log('Share knowledge')
        }
      ],
      dashboard: [
        {
          id: '9',
          title: 'Daily Check-in Reminder',
          description: 'Set a daily notification to track your habits and review progress.',
          type: 'habit',
          priority: 'high',
          action: () => console.log('Enable reminder')
        },
        {
          id: '10',
          title: 'Weekly Review Ritual',
          description: 'Spend 15 minutes every Sunday reviewing your week and planning ahead.',
          type: 'habit',
          priority: 'medium',
          action: () => console.log('Start weekly review')
        }
      ]
    };

    const contextSuggestions_list = contextSuggestions[context] || contextSuggestions.dashboard;
    setSuggestions(contextSuggestions_list);
    setDismissed(false);
    setCurrentIndex(0);
  };

  if (dismissed || suggestions.length === 0) {
    return null;
  }

  const current = suggestions[currentIndex];
  const priorityColors = {
    high: 'from-red-500 to-orange-500',
    medium: 'from-amber-500 to-yellow-500',
    low: 'from-blue-500 to-cyan-500'
  };

  return (
    <div className={`bg-gradient-to-r ${priorityColors[current.priority]} rounded-xl shadow-lg overflow-hidden animate-slide-in`}>
      <div className="p-5 text-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-white/20 rounded-lg mt-1">
              <Lightbulb size={18} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm mb-1">{current.title}</h4>
              <p className="text-xs opacity-90">{current.description}</p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {suggestions.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setCurrentIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={current.action}
              className="px-3 py-1 bg-white text-gray-800 rounded-lg text-xs font-bold hover:scale-105 transition-transform flex items-center gap-1"
            >
              Apply <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
