'use client';

import { useState } from 'react';
import { getApiUrl } from '@/lib/api';
import { Wand2, ChevronRight, ChevronLeft, Check, Loader } from 'lucide-react';

interface GeneratedGoal {
  title: string;
  description: string;
  category: string;
  timeframe: string;
  priority: string;
  actionSteps?: string[];
}

interface AIGoalWizardProps {
  onGoalCreated?: (goal: GeneratedGoal) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AIGoalWizard({ onGoalCreated, isOpen = true, onClose }: AIGoalWizardProps) {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState('3');
  const [loading, setLoading] = useState(false);
  const [generatedGoals, setGeneratedGoals] = useState<GeneratedGoal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<GeneratedGoal | null>(null);

  const availableInterests = [
    'Career Growth',
    'Health & Fitness',
    'Learning & Skills',
    'Personal Finance',
    'Relationships',
    'Creative Writing',
    'Mental Wellness',
    'Travel',
    'Entrepreneurship',
    'Reading',
  ];

  const handleGenerate = async () => {
    if (interests.length === 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('pf_token');
      const apiUrl = getApiUrl();

      const response = await fetch(`${apiUrl}/api/ai/goal-recommendations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interests,
          timeframe: `${timeframe} months`
        })
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedGoals(result.recommendations || generateMockGoals());
        setStep(3);
      }
    } catch (error) {
      console.error('Failed to generate goals:', error);
      setGeneratedGoals(generateMockGoals());
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const generateMockGoals = (): GeneratedGoal[] => [
    {
      title: 'Master a New Professional Skill',
      description: 'Complete an advanced certification in your field to enhance career prospects',
      category: 'Career',
      timeframe: '6 months',
      priority: 'High',
      actionSteps: ['Research courses', 'Enroll', 'Complete modules', 'Pass certification']
    },
    {
      title: 'Build Consistent Fitness Habit',
      description: 'Exercise 4-5 times per week for 30 minutes, focusing on strength and cardio',
      category: 'Health',
      timeframe: '3 months',
      priority: 'High',
      actionSteps: ['Join gym/studio', 'Create schedule', 'Track sessions', 'Adjust routine']
    },
    {
      title: 'Complete a Learning Project',
      description: 'Build a real-world project using your newly acquired skills',
      category: 'Learning',
      timeframe: '2 months',
      priority: 'Medium',
      actionSteps: ['Plan project', 'Set up environment', 'Build features', 'Deploy']
    }
  ];

  const handleSelectInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleCreateGoal = () => {
    if (selectedGoal) {
      onGoalCreated?.(selectedGoal);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white dark:bg-gray-900 w-full rounded-t-3xl shadow-2xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wand2 size={28} />
            <h2 className="text-2xl font-bold">AI Goal Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-8">
          {/* Step 1: Select Interests */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4">What areas interest you?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {availableInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => handleSelectInterest(interest)}
                      className={`p-3 rounded-lg border-2 font-bold transition-all ${
                        interests.includes(interest)
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-600 scale-105'
                          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {interests.includes(interest) && <Check size={16} className="inline mr-2" />}
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">What's your timeframe?</h3>
                <div className="flex gap-3">
                  {['1', '3', '6', '12'].map(months => (
                    <button
                      key={months}
                      onClick={() => setTimeframe(months)}
                      className={`px-6 py-3 rounded-lg font-bold border-2 transition-all ${
                        timeframe === months
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {months} months
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleGenerate()}
                  disabled={interests.length === 0 || loading}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Goals
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Select Generated Goal */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold mb-4">Choose your goal:</h3>
              <div className="space-y-3">
                {generatedGoals.map((goal, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedGoal(goal)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedGoal === goal
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-300 dark:border-gray-700 hover:border-purple-400'
                    }`}
                  >
                    <h4 className="font-bold mb-1">{goal.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{goal.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-2 py-1 rounded-full">
                        {goal.category}
                      </span>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded-full">
                        {goal.timeframe}
                      </span>
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-1 rounded-full">
                        {goal.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
                <button
                  onClick={handleCreateGoal}
                  disabled={!selectedGoal}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Create Goal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
