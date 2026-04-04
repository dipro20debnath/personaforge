'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Brain, ChevronRight, Check } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const options = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

export default function AssessmentPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string,number>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'start'|'test'|'result'>('start');

  useEffect(() => {
    api.getLatestAssessment().then(r => { if(r) setResult(r); });
    api.getQuestions().then(setQuestions);
  }, []);

  const startTest = () => { setResponses({}); setCurrentQ(0); setMode('test'); };

  const answer = (val: number) => {
    const q = questions[currentQ];
    setResponses(prev => ({ ...prev, [q.id]: val }));
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const r = await api.submitAssessment(responses);
      setResult(r);
      setMode('result');
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const radarData = result ? [
    { trait: 'Openness', value: result.openness },
    { trait: 'Conscientiousness', value: result.conscientiousness },
    { trait: 'Extraversion', value: result.extraversion },
    { trait: 'Agreeableness', value: result.agreeableness },
    { trait: 'Neuroticism', value: result.neuroticism },
  ] : [];

  const traitDescriptions: Record<string,string> = {
    openness: 'Creativity, curiosity, and openness to new experiences.',
    conscientiousness: 'Organization, dependability, and self-discipline.',
    extraversion: 'Sociability, assertiveness, and positive emotions.',
    agreeableness: 'Cooperation, trust, and empathy toward others.',
    neuroticism: 'Tendency to experience negative emotions and stress.',
  };

  if (mode === 'test' && questions.length > 0) {
    const q = questions[currentQ];
    const answered = Object.keys(responses).length;
    const allAnswered = answered === questions.length;
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><Brain size={28}/> Personality Assessment</h1>
        <div className="card max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500">Question {currentQ+1} of {questions.length}</span>
            <span className="badge bg-brand-100 text-brand-700">{Math.round((answered/questions.length)*100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
            <div className="h-full bg-brand-600 rounded-full transition-all" style={{width:`${(answered/questions.length)*100}%`}}/>
          </div>
          <h2 className="text-xl font-semibold mb-6 text-center">"{q.text}"</h2>
          <div className="space-y-3">
            {options.map(o => (
              <button key={o.value} onClick={()=>answer(o.value)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${responses[q.id]===o.value ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-400'}`}>
                <div className="flex items-center justify-between">
                  <span>{o.label}</span>
                  {responses[q.id]===o.value && <Check size={18} className="text-brand-600"/>}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={()=>setCurrentQ(Math.max(0,currentQ-1))} className="btn-secondary" disabled={currentQ===0}>Previous</button>
            {allAnswered ? (
              <button onClick={submit} className="btn-primary flex items-center gap-2" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Assessment'} <Check size={18}/>
              </button>
            ) : (
              <button onClick={()=>setCurrentQ(Math.min(questions.length-1,currentQ+1))} className="btn-primary flex items-center gap-1" disabled={currentQ===questions.length-1}>
                Next <ChevronRight size={18}/>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2"><Brain size={28}/> Personality Assessment</h1>
      <p className="text-gray-500 mb-8">Discover your Big Five personality traits using the scientifically validated IPIP framework</p>
      {result && (
        <div className="card max-w-3xl mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Personality Profile</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151"/>
                <PolarAngleAxis dataKey="trait" tick={{fill:'#9ca3af',fontSize:12}}/>
                <PolarRadiusAxis angle={30} domain={[0,5]} tick={{fill:'#6b7280',fontSize:10}}/>
                <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2}/>
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {Object.entries(traitDescriptions).map(([key, desc]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <span className="text-sm font-bold">{((result as any)[key] as number).toFixed(1)}/5</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-full bg-brand-600 rounded-full" style={{width:`${((result as any)[key]/5)*100}%`}}/>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <button onClick={startTest} className="btn-primary flex items-center gap-2">
        <Brain size={18}/> {result ? 'Retake Assessment' : 'Start Assessment'}
      </button>
    </div>
  );
}
