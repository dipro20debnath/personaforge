'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface UseAIOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useAIRecommendations(options?: UseAIOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  const fetchRecommendations = async (
    type: 'goals' | 'journal' | 'habits' | 'learning' | 'skills' | 'motivation',
    payload: any
  ) => {
    setLoading(true);
    setError(null);

    try {
      let result;
      switch (type) {
        case 'goals':
          result = await api.getGoalRecommendations(payload);
          break;
        case 'journal':
          result = await api.getJournalInsights(payload);
          break;
        case 'habits':
          result = await api.getHabitSuggestions(payload);
          break;
        case 'learning':
          result = await api.getLearningPath(payload.goal, payload.currentSkills);
          break;
        case 'skills':
          result = await api.analyzeSkillGaps(payload.currentSkills, payload.targetRole);
          break;
        case 'motivation':
          result = await api.getMotivationalInsights(payload);
          break;
      }

      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch recommendations');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    data,
    fetchRecommendations,
  };
}

// Specialized hooks for each AI feature
export function useGoalRecommendations(options?: UseAIOptions) {
  const { loading, error, data, fetchRecommendations } = useAIRecommendations(options);

  const getRecommendations = (userProfile: any) =>
    fetchRecommendations('goals', userProfile);

  return { loading, error, recommendations: data?.recommendations, getRecommendations };
}

export function useJournalInsights(options?: UseAIOptions) {
  const { loading, error, data, fetchRecommendations } = useAIRecommendations(options);

  const analyze = (entries: any[]) => fetchRecommendations('journal', entries);

  return { loading, error, insights: data?.insights, analyze };
}

export function useHabitSuggestions(options?: UseAIOptions) {
  const { loading, error, data, fetchRecommendations } = useAIRecommendations(options);

  const getSuggestions = (currentHabits: any[]) =>
    fetchRecommendations('habits', currentHabits);

  return { loading, error, suggestions: data?.suggestions, getSuggestions };
}

export function useLearningPath(options?: UseAIOptions) {
  const { loading, error, data, fetchRecommendations } = useAIRecommendations(options);

  const generate = (goal: string, currentSkills: string[]) =>
    fetchRecommendations('learning', { goal, currentSkills });

  return { loading, error, path: data?.learningPath, generate };
}

export function useSkillGapAnalysis(options?: UseAIOptions) {
  const { loading, error, data, fetchRecommendations } = useAIRecommendations(options);

  const analyze = (currentSkills: string[], targetRole: string) =>
    fetchRecommendations('skills', { currentSkills, targetRole });

  return { loading, error, analysis: data?.analysis, analyze };
}

export function useMotivationalInsights(options?: UseAIOptions) {
  const { loading, error, data, fetchRecommendations } = useAIRecommendations(options);

  const getInsights = (userProgress: any) =>
    fetchRecommendations('motivation', userProgress);

  return { loading, error, insights: data?.insights, getInsights };
}

export function useAIChat(options?: UseAIOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (message: string, context: string = 'general') => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.sendChatMessage(message, context);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, sendMessage };
}
