'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Target, Star, Zap, PenLine, Plane, ArrowRight, CheckSquare, Flame, BookOpen, Brain, Activity } from 'lucide-react';
import { AIRecommendations } from '@/components/AIRecommendations';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  
  useEffect(() => { 
    api.getDashboard().then(setData).catch(console.error); 
  }, []);

  if (!data) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full"/></div>;

  const { profile, personality, stats, skills, activeGoals, abroadGoals, recentJournal } = data;

  const personalityData = personality ? [
    { trait: 'Openness', value: personality.openness, fullMark: 5 },
    { trait: 'Conscientiousness', value: personality.conscientiousness, fullMark: 5 },
    { trait: 'Extraversion', value: personality.extraversion, fullMark: 5 },
    { trait: 'Agreeableness', value: personality.agreeableness, fullMark: 5 },
    { trait: 'Neuroticism', value: personality.neuroticism, fullMark: 5 },
  ] : [];

  const skillData = skills.map((s: any) => ({ name: s.name.length > 10 ? s.name.slice(0,10)+'..' : s.name, You: s.self_level, World: s.world_avg }));

  const statCards = [
    { icon: Star, label: 'Level', value: stats.level, color: 'text-yellow-500' },
    { icon: Zap, label: 'XP', value: stats.xp, color: 'text-brand-500' },
    { icon: TrendingUp, label: 'Skills', value: stats.totalSkills, color: 'text-green-500' },
    { icon: Target, label: 'Active Goals', value: stats.activeGoals, color: 'text-purple-500' },
    { icon: Plane, label: 'Abroad Goals', value: stats.totalAbroadGoals, color: 'text-blue-500' },
    { icon: CheckSquare, label: 'Habits Today', value: `${stats.habitsCompletedToday}/${stats.totalHabits}`, color: 'text-teal-500' },
    { icon: Flame, label: 'Total Streak', value: stats.totalStreak, color: 'text-orange-500' },
    { icon: PenLine, label: 'Journal', value: stats.journalEntries, color: 'text-pink-500' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="space-y-3">
        <div>
          <h1 className="section-title text-4xl">Welcome back, {profile.display_name || 'Explorer'}! 👋</h1>
          <p className="section-subtitle text-base mt-2">Here&apos;s your personal growth overview for today</p>
        </div>
      </div>

      {/* Premium Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="card-hover group relative overflow-hidden" style={{ animation: `slideInUp 0.5s ease-out ${i * 50}ms both` }}>
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{s.label}</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">{s.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${
                s.label === 'Level' ? 'from-yellow-400 to-yellow-600' :
                s.label === 'XP' ? 'from-blue-400 to-blue-600' :
                s.label === 'Skills' ? 'from-green-400 to-green-600' :
                s.label === 'Active Goals' ? 'from-purple-400 to-purple-600' :
                s.label === 'Abroad Goals' ? 'from-cyan-400 to-blue-600' :
                s.label === 'Habits Today' ? 'from-teal-400 to-teal-600' :
                s.label === 'Total Streak' ? 'from-orange-400 to-orange-600' :
                'from-pink-400 to-pink-600'
              } text-white shadow-lg`}>
                <s.icon size={24}/>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Recommendations Section - Premium */}
      <div className="animate-slideInUp" style={{ animationDelay: '200ms' }}>
        <AIRecommendations 
          userProfile={profile}
          currentHabits={[]}
          userProgress={{
            goalsCompleted: stats.completedGoals,
            habitsTracked: stats.totalHabits,
            streak: stats.totalStreak,
          }}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Personality Radar */}
        <div className="card-hover" style={{ animation: `slideInLeft 0.6s ease-out 300ms both` }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">🧠 Personality Profile</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your Big Five traits</p>
            </div>
          </div>
          {personality ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={personalityData}>
                <PolarGrid stroke="#e2e8f0" strokeOpacity={0.3} />
                <PolarAngleAxis dataKey="trait" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}/>
                <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 10 }}/>
                <Radar name="You" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2.5}/>
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Brain size={32} className="mb-2 opacity-50" />
              <p className="text-sm">Take your personality assessment to see results</p>
            </div>
          )}
        </div>

        {/* Skills Chart */}
        <div className="card-hover" style={{ animation: `slideInRight 0.6s ease-out 300ms both` }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">📊 Skills vs World Average</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your proficiency compared</p>
            </div>
          </div>
          {skillData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={skillData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                <XAxis type="number" domain={[0,10]} tick={{ fill: '#94a3b8', fontSize: 11 }}/>
                <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}/>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="You" fill="#3b82f6" radius={[0,8,8,0]} />
                <Bar dataKey="World" fill="#cbd5e1" radius={[0,8,8,0]} opacity={0.6}/>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Activity size={32} className="mb-2 opacity-50" />
              <p className="text-sm">Add skills to see your comparison chart</p>
            </div>
          )}
        </div>
      </div>

      {/* Goals and Progress */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Goals */}
        <div className="lg:col-span-2 card-hover" style={{ animation: `slideInUp 0.7s ease-out 400ms both` }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">🎯 Active Goals</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activeGoals.length} goals in progress</p>
            </div>
            <button onClick={() => router.push('/goals')} className="btn btn-sm btn-secondary">View All</button>
          </div>
          {activeGoals.length > 0 ? (
            <div className="space-y-4">
              {activeGoals.slice(0, 3).map((g: any) => (
                <div key={g.id} className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-950/20 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{g.title}</span>
                    <span className="badge badge-blue text-xs">{Math.round((g.current_value/g.target_value)*100)}%</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" style={{width:`${Math.min(100,(g.current_value/g.target_value)*100)}%`}}/>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{g.current_value} / {g.target_value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Target size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active goals. Set one to get started!</p>
            </div>
          )}
        </div>

        {/* Abroad Goals */}
        <div className="card-hover" style={{ animation: `slideInUp 0.7s ease-out 500ms both` }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">✈️ Abroad Goals</h2>
            <button onClick={() => router.push('/abroad-goals')} className="text-xs text-blue-500 hover:text-blue-600 font-semibold">View All</button>
          </div>
          {abroadGoals && abroadGoals.length > 0 ? (
            <div className="space-y-3">
              {abroadGoals.slice(0, 2).map((g: any) => (
                <div 
                  key={g.id} 
                  className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg cursor-pointer hover:shadow-md transition-all border border-blue-200 dark:border-blue-800"
                  onClick={() => router.push(`/abroad-goals/${g.id}`)}
                >
                  <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">{g.destination || 'Unnamed'}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">{g.visa_status || 'Planning'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Plane size={24} className="mx-auto mb-2 opacity-50 text-gray-400" />
              <p className="text-xs text-gray-400 mb-3">No abroad goals yet</p>
              <button onClick={() => router.push('/abroad-goals')} className="btn btn-sm btn-primary w-full">
                Create Goal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Journal and Quick Stats */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Journal */}
        <div className="card-hover" style={{ animation: `slideInLeft 0.7s ease-out 600ms both` }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">📝 Recent Journal</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your thoughts and reflections</p>
            </div>
            <button onClick={() => router.push('/journal')} className="btn btn-sm btn-secondary">New Entry</button>
          </div>
          {recentJournal.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentJournal.map((j: any) => (
                <div key={j.id} className="p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg border border-pink-200 dark:border-pink-800 cursor-pointer hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{j.title || 'Untitled'}</p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{new Date(j.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{j.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <PenLine size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start journaling to see entries here</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="card-hover" style={{ animation: `slideInRight 0.7s ease-out 600ms both` }}>
          <div>
            <h2 className="text-xl font-bold mb-6">📈 Quick Stats</h2>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total Habits</span>
                  <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stats.totalHabits}</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Completed Goals</span>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.completedGoals}</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Streak (Days)</span>
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.totalStreak}</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">XP Points</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.xp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
