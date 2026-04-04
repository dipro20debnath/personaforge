'use client';
import Link from 'next/link';
import { ArrowRight, Brain, Target, TrendingUp, BookOpen, Shield, Sparkles } from 'lucide-react';

const features = [
  { icon: Brain, title: 'Personality Assessment', desc: 'Discover your Big Five personality traits with scientifically validated IPIP assessment.' },
  { icon: TrendingUp, title: 'Skill Tracking', desc: 'Track your skills, compare with world benchmarks, and identify growth areas.' },
  { icon: Target, title: 'SMART Goals', desc: 'Set measurable goals with milestones and track your progress in real time.' },
  { icon: BookOpen, title: 'Learning Paths', desc: 'Get personalized free learning resources curated for your growth areas.' },
  { icon: Shield, title: 'Privacy First', desc: 'Your data is yours. Export or delete anytime. Full transparency.' },
  { icon: Sparkles, title: 'XP & Levels', desc: 'Earn experience points for every action. Level up your personal growth journey.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <nav className="flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">P</div>
          <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">PersonaForge</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary text-sm">Log In</Link>
          <Link href="/register" className="btn-primary text-sm flex items-center gap-1">Get Started <ArrowRight size={16}/></Link>
        </div>
      </nav>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="badge bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 mb-6">✨ Your Personal Growth Companion</div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Shape Your <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Future Self</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Assess your personality, track skills, build habits, set goals, and stay ahead of the world — all in one powerful platform.
        </p>
        <Link href="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2">
          Start Free <ArrowRight size={20}/>
        </Link>
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="card hover:shadow-lg hover:-translate-y-1 transition-all cursor-default">
            <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center mb-4">
              <f.icon className="text-brand-600" size={24}/>
            </div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>
      <footer className="text-center py-8 text-sm text-gray-500 border-t dark:border-gray-800">
        © {new Date().getFullYear()} PersonaForge. Built for personal growth.
      </footer>
    </div>
  );
}
