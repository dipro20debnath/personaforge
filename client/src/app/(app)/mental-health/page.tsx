'use client';

import WellnessTracker from '@/components/WellnessTracker';
import { Heart, ExternalLink, Phone, BookOpen, AlertTriangle } from 'lucide-react';

const resources = [
  { title:'WHO Mental Health Resources', url:'https://www.who.int/health-topics/mental-health', type:'International' },
  { title:'MindTools: Stress Management', url:'https://www.mindtools.com/pages/main/newMN_TCS.htm', type:'Self-help' },
  { title:'Headspace: Meditation Guide', url:'https://www.headspace.com/meditation', type:'Meditation' },
  { title:'HelpGuide: Mental Health', url:'https://www.helpguide.org/articles/mental-health/building-better-mental-health.htm', type:'Guide' },
  { title:'National Institute of Mental Health', url:'https://nimh.gov.bd/', type:'Bangladesh' },
  { title:'Kaan Pete Roi (কান পেতে রই)', url:'https://findahelpline.com/organizations/kaan-pete-roi', type:'Helpline' },
];

const tips = [
  '🧘 Practice mindfulness for 5 minutes daily',
  '🏃 Move your body — even a 15-minute walk helps',
  '😴 Prioritize 7-8 hours of quality sleep',
  '🤝 Connect with someone you trust today',
  '📝 Write down 3 things you\'re grateful for',
  '🚫 Take a break from screens and social media',
  '💧 Stay hydrated — drink at least 8 glasses of water',
  '🎵 Listen to music that makes you feel good',
];

export default function MentalHealthPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2"><Heart size={36} className="text-red-500"/> Wellness & Mental Health</h1>
        <p className="text-gray-600 text-lg">Track your wellness, access resources, and support your mental well-being</p>
      </div>

      {/* Wellness Tracker Component */}
      <WellnessTracker />

      <div className="card mb-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-yellow-600 mt-1" size={20}/>
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Important Disclaimer</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">PersonaForge is NOT a substitute for professional mental health care. If you&apos;re experiencing a crisis, please contact a mental health professional or call a helpline immediately.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Phone size={20}/> Helplines & Support</h2>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <p className="font-semibold text-red-700 dark:text-red-300">Emergency</p>
              <p className="text-sm text-red-600">National Emergency: 999</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <p className="font-semibold text-blue-700 dark:text-blue-300">Kaan Pete Roi</p>
              <p className="text-sm text-blue-600">Emotional Support Helpline (Bangla/English)</p>
            </div>
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">🌟 Daily Wellness Tips</h2>
          <div className="space-y-2">{tips.map((t,i) => (<div key={i} className="p-2 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg">{t}</div>))}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen size={20}/> Resources</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {resources.map((r,i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border dark:border-gray-800">
              <ExternalLink size={16} className="text-brand-600"/>
              <div className="flex-1"><p className="text-sm font-medium">{r.title}</p><p className="text-xs text-gray-500">{r.type}</p></div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
