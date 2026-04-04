'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Globe, Plus, Target, FileText, TrendingUp, Calendar, DollarSign, BookOpen, Zap } from 'lucide-react';

export default function AbroadGoalsPage() {
  const { token } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    educationLevel: 'bachelors',
    intakeMonth: 'september',
    intakeYear: new Date().getFullYear() + 1,
    studyField: ''
  });

  useEffect(() => {
    if (token) {
      fetchGoals();
    }
  }, [token]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = await api.getAbroadGoals();
      console.log('Fetched abroad goals:', data);
      setGoals(data);
    } catch (err: any) {
      console.error('Failed to fetch abroad goals:', err);
      setFormError(`Failed to load goals: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination.trim()) {
      setFormError('Please enter a destination country');
      return;
    }
    if (!formData.studyField.trim()) {
      setFormError('Please enter your study field');
      return;
    }
    
    setFormError(null);
    setFormLoading(true);
    try {
      console.log('Creating abroad goal with data:', formData);
      const response = await api.createAbroadGoal(formData);
      console.log('Goal created successfully:', response);
      
      setShowCreateForm(false);
      setFormData({
        destination: '',
        educationLevel: 'bachelors',
        intakeMonth: 'september',
        intakeYear: new Date().getFullYear() + 1,
        studyField: ''
      });
      
      // Refetch goals after small delay to ensure DB is updated
      setTimeout(() => {
        fetchGoals();
      }, 500);
    } catch (err: any) {
      const errorMsg = err?.message || 'Failed to create goal. Please try again.';
      console.error('Create goal error:', err);
      setFormError(errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'text-green-600 dark:text-green-400';
    if (progress >= 50) return 'text-blue-600 dark:text-blue-400';
    if (progress >= 25) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600  dark:text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-10 h-10 text-brand-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              Abroad Goals
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Plan your international education journey step by step</p>
        </div>

        {/* Create Goal Button */}
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all mb-6"
          >
            <Plus size={20} /> Start a New Abroad Goal
          </button>
        )}

        {/* Create Goal Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Plan Your Abroad Journey</h2>
            {formError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-400">{formError}</p>
              </div>
            )}
            <form onSubmit={handleCreateGoal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Destination Country *</label>
                <input
                  type="text"
                  placeholder="e.g., Canada, USA, UK, Australia"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Education Level</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({...formData, educationLevel: e.target.value})}
                  className="input"
                >
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="diploma">Diploma</option>
                  <option value="certification">Certification</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Study Field *</label>
                <input
                  type="text"
                  placeholder="e.g., Computer Science, Business, Medicine"
                  value={formData.studyField}
                  onChange={(e) => setFormData({...formData, studyField: e.target.value})}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Intake Year</label>
                <select
                  value={formData.intakeYear}
                  onChange={(e) => setFormData({...formData, intakeYear: parseInt(e.target.value)})}
                  className="input"
                >
                  {[...Array(5)].map((_, i) => (
                    <option key={i} value={new Date().getFullYear() + i}>
                      {new Date().getFullYear() + i}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Intake Month</label>
                <select
                  value={formData.intakeMonth}
                  onChange={(e) => setFormData({...formData, intakeMonth: e.target.value})}
                  className="input"
                >
                  <option value="january">January</option>
                  <option value="february">February</option>
                  <option value="march">March</option>
                  <option value="april">April</option>
                  <option value="may">May</option>
                  <option value="june">June</option>
                  <option value="july">July</option>
                  <option value="august">August</option>
                  <option value="september">September</option>
                  <option value="october">October</option>
                  <option value="november">November</option>
                  <option value="december">December</option>
                </select>
              </div>

              <div className="flex gap-3 md:col-span-2">
                <button 
                  type="submit" 
                  disabled={formLoading}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? 'Creating...' : 'Create Goal'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormError(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your abroad goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800">
            <Globe className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Abroad Goals Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start planning your international education journey today!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} /> Create Your First Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <a
                key={goal.id}
                href={`/abroad-goals/${goal.id}`}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-brand-400 dark:hover:border-brand-600 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">
                      {goal.destination_country}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {goal.education_level} • {goal.study_field}
                    </p>
                  </div>
                  <span className="text-3xl">{goal.intake_year}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall Progress</span>
                    <span className={`text-lg font-bold ${getProgressColor(goal.progress)}`}>
                      {goal.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-purple-600 h-2 rounded-full transition-all"
                      style={{width: `${goal.progress}%`}}
                    ></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="text-center">
                    <FileText size={18} className="mx-auto mb-1 text-brand-600" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Documents</p>
                    <p className="font-bold">{goal.documents?.completed}/{goal.documents?.total}</p>
                  </div>
                  <div className="text-center">
                    <Target size={18} className="mx-auto mb-1 text-blue-600" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Requirements</p>
                    <p className="font-bold">{goal.requirements?.completed}/{goal.requirements?.total}</p>
                  </div>
                  <div className="text-center">
                    <Zap size={18} className="mx-auto mb-1 text-yellow-600" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Timeline</p>
                    <p className="font-bold">{goal.timeline?.completed}/{goal.timeline?.total}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                  <span className="text-xs font-semibold px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                    {goal.visa_status || 'Planning'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {goal.intake_month} {goal.intake_year}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Key Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <Target className="w-8 h-8 text-brand-600 mb-2" />
            <h4 className="font-semibold mb-1">Requirements Tracker</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track all academic and visa requirements</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-semibold mb-1">Document Checklist</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage all required documents</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-semibold mb-1">Skill Development</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track language exams and skills</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <DollarSign className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-semibold mb-1">Budget Planning</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track expenses and savings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
