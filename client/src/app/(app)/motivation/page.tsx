'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Heart, Lock, RefreshCw, Play, Quote, TrendingUp, CheckCircle2, Circle } from 'lucide-react';

interface Challenge {
  day: number;
  title: string;
  description: string;
  completed: boolean;
  phase: number; // 1-5 for 100 days divided into 5 phases of 20 days
}

export default function MotivationalSpacePage() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [displayDay, setDisplayDay] = useState(1);
  const [todayDay, setTodayDay] = useState(1);
  const [challengeStartDate, setChallengeStartDate] = useState<string | null>(null);

  const motivationalVideos = [
    { id: 1, title: 'Self-Love Journey', youtubeId: 'dQw4w9WgXcQ', duration: '12:45' },
    { id: 2, title: 'Transform Yourself in 100 Days', youtubeId: 'dQw4w9WgXcQ', duration: '15:30' },
    { id: 3, title: 'The Power of Self-Compassion', youtubeId: 'dQw4w9WgXcQ', duration: '18:20' },
    { id: 4, title: 'Daily Affirmations for Growth', youtubeId: 'dQw4w9WgXcQ', duration: '8:15' },
    { id: 5, title: 'Overcoming Self-Doubt', youtubeId: 'dQw4w9WgXcQ', duration: '22:10' },
    { id: 6, title: '100-Day Challenge Motivation', youtubeId: 'dQw4w9WgXcQ', duration: '14:00' },
  ];

  const dailyChallenges = Array.from({ length: 100 }, (_, i) => {
    const dayNum = i + 1;
    const phase = Math.ceil(dayNum / 20);
    const challengeTitles = [
      'Practice Self-Affirmation',
      'Journal Your Thoughts',
      'Meditation Session',
      'Gratitude Practice',
      'Self-Care Ritual',
      'Act of Kindness',
      'Set Boundaries',
      'Rest Without Guilt',
      'Celebrate Small Wins',
      'Connect with Yourself',
    ];
    const descriptions = [
      'Start your day with positive affirmations about yourself',
      'Write down 3 things you appreciate about yourself',
      'Spend 10 minutes meditating on self-love',
      'List 5 things you\'re grateful for today',
      'Do something that makes you feel good',
      'Help someone without expecting anything back',
      'Practice saying no to something that doesn\'t serve you',
      'Give yourself permission to take a break',
      'Acknowledge one accomplishment today',
      'Have a heart-to-heart conversation with yourself',
    ];
    return {
      day: dayNum,
      title: challengeTitles[dayNum % challengeTitles.length],
      description: descriptions[dayNum % descriptions.length],
      completed: false,
      phase: phase,
    };
  });

  useEffect(() => {
    loadData();
  }, []);

  // Update displayDay when todayDay changes
  useEffect(() => {
    setDisplayDay(todayDay);
  }, [todayDay]);

  const loadData = async () => {
    try {
      const [progressData] = await Promise.all([
        api.get100DayChallenge?.().catch(() => ({})),
      ]);
      
      let completedCount = 0;
      let startDate = new Date().toISOString().split('T')[0]; // default to today
      let calculatedTodayDay = 1;
      
      if (progressData?.dailyChallenges) {
        const completed = progressData.dailyChallenges.reduce((acc: any, c: any) => {
          acc[c.day] = c.completed;
          if (c.completed) completedCount++;
          return acc;
        }, {});
        
        setChallenges(dailyChallenges.map(c => ({ ...c, completed: completed[c.day] || false })));
      } else {
        setChallenges(dailyChallenges);
      }
      
      // Use server-calculated todayDay if available, otherwise calculate here
      if (progressData?.todayDay) {
        calculatedTodayDay = progressData.todayDay;
      } else if (progressData?.startDate) {
        // Fallback calculation if server doesn't return todayDay
        startDate = progressData.startDate;
        const today = new Date();
        const challStart = new Date(startDate);
        const diffTime = today.getTime() - challStart.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        calculatedTodayDay = Math.min(Math.max(diffDays, 1), 100);
      }
      
      if (progressData?.startDate) {
        startDate = progressData.startDate;
      }
      
      setChallengeStartDate(startDate);
      setTodayDay(calculatedTodayDay);
      
      // Load quote for today
      const quoteData = await api.getDailyQuote?.(calculatedTodayDay).catch(() => ({}));
      if (quoteData?.quote) {
        setQuote(quoteData.quote);
        setAuthor(quoteData.author || 'Unknown');
      }
      
      setUserProgress(progressData);
      setCurrentPhase(Math.ceil(calculatedTodayDay / 20));
    } catch (e) {
      console.error(e);
      setChallenges(dailyChallenges);
    } finally {
      setLoading(false);
    }
  };

  const completeChallenge = async (day: number) => {
    try {
      await api.complete100DayChallenge?.({ day });
      setChallenges(challenges.map(c => c.day === day ? { ...c, completed: !c.completed } : c));
    } catch (e) {
      console.error(e);
    }
  };

  const loadQuoteForDay = async (day: number) => {
    try {
      const quoteData = await api.getDailyQuote?.(day);
      if (quoteData?.quote) {
        setQuote(quoteData.quote);
        setAuthor(quoteData.author || 'Unknown');
        setDisplayDay(day);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const nextQuote = () => {
    const nextDay = Math.min(displayDay + 1, 100);
    loadQuoteForDay(nextDay);
  };

  const prevQuote = () => {
    const prevDay = Math.max(displayDay - 1, 1);
    loadQuoteForDay(prevDay);
  };

  const getPhaseDescription = (phase: number) => {
    const phases = [
      '🌱 Phase 1: Foundation (Days 1-20) - Build self-awareness',
      '🌿 Phase 2: Growth (Days 21-40) - Strengthen self-love practices',
      '🌳 Phase 3: Bloom (Days 41-60) - Express authentic self',
      '🌲 Phase 4: Flourish (Days 61-80) - Embrace your power',
      '✨ Phase 5: Radiance (Days 81-100) - Live your best self',
    ];
    return phases[phase - 1] || phases[0];
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const phaseProgress = challenges.filter(c => c.phase === currentPhase && c.completed).length;
  const phaseTotalDays = challenges.filter(c => c.phase === currentPhase).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="text-red-500" size={36} /> Motivational Space
        </h1>
        <p className="text-gray-500 mt-1">Your journey to self-love and daily transformation</p>
      </div>

      {/* Daily Quote */}
      <div className="card mb-8 p-8 bg-gradient-to-r from-brand-500 to-purple-600 text-white rounded-2xl">
        <div className="flex gap-4">
          <Quote size={32} className="mt-1 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold opacity-90">Day {displayDay} Quote</h3>
              <span className="text-xs opacity-75">{displayDay}/100</span>
            </div>
            <p className="text-xl font-semibold italic mb-2">"{quote}"</p>
            <p className="text-sm opacity-90 mb-4">— {author}</p>
            <div className="flex gap-2">
              <button onClick={prevQuote} disabled={displayDay === 1} className="px-3 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-lg flex items-center gap-1 text-sm">
                ← Previous
              </button>
              <button onClick={nextQuote} disabled={displayDay === 100} className="px-3 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 rounded-lg flex items-center gap-1 text-sm">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6">
          <p className="text-gray-500 text-sm mb-1">Current Phase</p>
          <p className="text-3xl font-bold text-brand-600">{currentPhase}/5</p>
          <p className="text-xs mt-2 text-gray-600">{getPhaseDescription(currentPhase)}</p>
        </div>
        <div className="card p-6">
          <p className="text-gray-500 text-sm mb-1">Days Completed</p>
          <p className="text-3xl font-bold text-green-600">{completedCount}/100</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2">
            <div className="bg-green-500 h-full rounded-full" style={{ width: `${(completedCount / 100) * 100}%` }}/>
          </div>
        </div>
        <div className="card p-6">
          <p className="text-gray-500 text-sm mb-1">Phase Progress</p>
          <p className="text-3xl font-bold text-purple-600">{phaseProgress}/{phaseTotalDays}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${(phaseProgress / phaseTotalDays) * 100}%` }}/>
          </div>
        </div>
      </div>

      {/* Motivational Videos */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Play size={24} className="text-brand-600" /> Motivational Videos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {motivationalVideos.map(video => (
            <div key={video.id} onClick={() => setSelectedVideo(video)} className="card cursor-pointer hover:shadow-lg transition-all">
              <div className="bg-gray-300 dark:bg-gray-700 aspect-video rounded-lg flex items-center justify-center mb-3 relative group">
                <Play size={40} className="text-gray-500 group-hover:text-white transition-all" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all"/>
              </div>
              <h3 className="font-semibold text-sm">{video.title}</h3>
              <p className="text-xs text-gray-500">{video.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full">
            <div className="aspect-video bg-black rounded-t-xl">
              <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`} frameBorder="0" allowFullScreen className="rounded-t-xl"/>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
              <button onClick={() => setSelectedVideo(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 100-Day Challenge Grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp size={24} className="text-brand-600" /> 100-Day Self-Love Challenge
          </h2>
          <div className="text-sm font-semibold text-brand-600">{completedCount} Days Completed</div>
        </div>

        {/* Phase Breakdown */}
        {Array.from({ length: 5 }, (_, i) => i + 1).map(phase => {
          const phaseChallenges = challenges.filter(c => c.phase === phase);
          const phaseCompleted = phaseChallenges.filter(c => c.completed).length;
          return (
            <div key={phase} className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-lg">{getPhaseDescription(phase)}</h3>
                <span className="text-xs bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 px-3 py-1 rounded-full">
                  {phaseCompleted}/{phaseChallenges.length}
                </span>
              </div>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {phaseChallenges.map(challenge => (
                  <button
                    key={challenge.day}
                    onClick={() => completeChallenge(challenge.day)}
                    title={`Day ${challenge.day}: ${challenge.title}`}
                    className={`aspect-square rounded-lg flex items-center justify-center font-bold text-sm transition-all hover:scale-110 ${
                      challenge.completed
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-brand-100 dark:hover:bg-brand-900'
                    }`}
                  >
                    {challenge.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Challenge Detail */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Today's Challenge (Day {todayDay})</h2>
        <div className="space-y-4">
          {challenges.filter(c => c.day === todayDay).map(c => (
            <div key={c.day} className="p-4 border-l-4 border-brand-600 bg-brand-50 dark:bg-brand-900/20 rounded">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">Day {c.day}: {c.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{c.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{getPhaseDescription(c.phase)}</p>
                </div>
                <button
                  onClick={() => completeChallenge(c.day)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ml-4 transition-all ${
                    c.completed
                      ? 'bg-green-500 text-white'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {c.completed ? '✓ Done' : 'Complete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
