'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { TrendingUp, DollarSign, AlertCircle, Plus, Trash2, PieChart, TrendingDown } from 'lucide-react';
import { PieChart as PieChartIcon, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface MoneyEntry {
  id: string;
  type: 'income' | 'expense' | 'asset' | 'liability';
  category: string;
  amount: number;
  description: string;
  date: string;
}

export default function MoneyManagementPage() {
  const [entries, setEntries] = useState<MoneyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [formType, setFormType] = useState<'income' | 'expense' | 'asset' | 'liability'>('income');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [stats, setStats] = useState<any>(null);

  const categories = {
    income: ['Salary', 'Business', 'Investment', 'Side Hustle', 'Bonus', 'Other Income'],
    expense: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Shopping', 'Other'],
    asset: ['Savings', 'Stocks', 'Real Estate', 'Business Asset', 'Cryptocurrency', 'Other Asset'],
    liability: ['Mortgage', 'Car Loan', 'Credit Card', 'Student Loan', 'Personal Loan', 'Other Debt'],
  };

  const categoryColors = {
    // Income
    'Salary': '#10b981',
    'Business': '#059669',
    'Investment': '#047857',
    'Side Hustle': '#065f46',
    'Bonus': '#064e3b',
    // Expense
    'Food': '#ef4444',
    'Transport': '#dc2626',
    'Entertainment': '#b91c1c',
    'Utilities': '#991b1b',
    'Healthcare': '#7f1d1d',
    'Education': '#fbbf24',
    'Shopping': '#f59e0b',
    // Asset
    'Savings': '#3b82f6',
    'Stocks': '#2563eb',
    'Real Estate': '#1d4ed8',
    'Business Asset': '#1e40af',
    'Cryptocurrency': '#1e3a8a',
    // Liability
    'Mortgage': '#8b5cf6',
    'Car Loan': '#7c3aed',
    'Credit Card': '#6d28d9',
    'Student Loan': '#5b21b6',
    'Personal Loan': '#4c1d95',
  };

  const richDadPoorDadRules = [
    { title: 'Focus on Income', icon: '💰', description: 'Increase your earned income and create multiple income streams' },
    { title: 'Assets vs Liabilities', icon: '📊', description: 'Assets put money in your pocket; liabilities take money out' },
    { title: 'Track Everything', icon: '📝', description: 'You cannot manage what you do not measure' },
    { title: 'Tax Efficiency', icon: '🏛️', description: 'Use legal strategies to minimize tax burden' },
    { title: 'Build Passive Income', icon: '🌳', description: 'Work to learn, not just to earn. Build systems that generate income' },
    { title: 'Financial Literacy', icon: '📚', description: 'Understand financial statements and cash flow' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getMoneyManagement?.().catch(() => ({}));
      if (data?.entries) {
        setEntries(data.entries);
      }
      calculateStats(data?.entries || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allEntries: MoneyEntry[]) => {
    const income = allEntries
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const expenses = allEntries
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const assets = allEntries
      .filter(e => e.type === 'asset')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const liabilities = allEntries
      .filter(e => e.type === 'liability')
      .reduce((sum, e) => sum + e.amount, 0);

    const netWorth = assets - liabilities;
    const savings = income - expenses;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

    setStats({
      totalIncome: income,
      totalExpenses: expenses,
      totalAssets: assets,
      totalLiabilities: liabilities,
      netWorth,
      monthlySavings: savings,
      savingsRate,
      assetToLiabilityRatio: liabilities > 0 ? (assets / liabilities).toFixed(2) : assets > 0 ? '∞' : '0',
    });
  };

  const addEntry = async () => {
    if (!formAmount || !formCategory || !formDescription) {
      alert('Please fill all fields');
      return;
    }

    try {
      await api.addMoneyEntry?.({
        type: formType,
        category: formCategory,
        amount: parseFloat(formAmount),
        description: formDescription,
        date: new Date().toISOString(),
      });

      setFormAmount('');
      setFormCategory('');
      setFormDescription('');
      await loadData();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await api.deleteMoneyEntry?.({ id });
      await loadData();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const incomeByCategory = entries
    .filter(e => e.type === 'income')
    .reduce((acc: any, e) => {
      const existing = acc.find((a: any) => a.name === e.category);
      if (existing) {
        existing.value += e.amount;
      } else {
        acc.push({ name: e.category, value: e.amount });
      }
      return acc;
    }, []);

  const expenseByCategory = entries
    .filter(e => e.type === 'expense')
    .reduce((acc: any, e) => {
      const existing = acc.find((a: any) => a.name === e.category);
      if (existing) {
        existing.value += e.amount;
      } else {
        acc.push({ name: e.category, value: e.amount });
      }
      return acc;
    }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full"/></div>;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <DollarSign className="text-green-600" size={36} /> Money Management
        </h1>
        <p className="text-gray-500 mt-1">Based on "Rich Dad, Poor Dad" principles - Track assets, liabilities, and cash flow</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Total Income</p>
          <p className="text-2xl font-bold text-green-600">${stats?.totalIncome.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">${stats?.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Total Assets</p>
          <p className="text-2xl font-bold text-blue-600">${stats?.totalAssets.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-gray-500 mb-1">Total Liabilities</p>
          <p className="text-2xl font-bold text-purple-600">${stats?.totalLiabilities.toFixed(2)}</p>
        </div>
      </div>

      {/* Net Worth & Savings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6 bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Net Worth</p>
          <p className={`text-3xl font-bold ${stats?.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats?.netWorth.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Assets - Liabilities</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Monthly Savings</p>
          <p className={`text-3xl font-bold ${stats?.monthlySavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${stats?.monthlySavings.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-2">Income - Expenses</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Savings Rate</p>
          <p className="text-3xl font-bold text-brand-600">{stats?.savingsRate}%</p>
          <p className="text-xs text-gray-500 mt-2">Target: 20%+</p>
        </div>
      </div>

      {/* Rich Dad Poor Dad Rules */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle size={24} className="text-brand-600" /> Rich Dad, Poor Dad Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {richDadPoorDadRules.map((rule, idx) => (
            <div key={idx} className="card p-4">
              <div className="text-3xl mb-2">{rule.icon}</div>
              <h3 className="font-semibold mb-1">{rule.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Entry Form */}
      <div className="card mb-8 p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={20}/> Add Transaction</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select value={formType} onChange={e => setFormType(e.target.value as any)} className="input w-full">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="asset">Asset</option>
              <option value="liability">Liability</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="input w-full">
              <option value="">Select...</option>
              {categories[formType].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0.00" className="input w-full"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input type="text" value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Details..." className="input w-full"/>
          </div>
          <div className="flex items-end">
            <button onClick={addEntry} className="btn-primary w-full flex items-center justify-center gap-2">
              <Plus size={18}/> Add
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {incomeByCategory.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Income by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChartIcon>
                <Pie data={incomeByCategory} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {incomeByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[entry.name as keyof typeof categoryColors] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${typeof value === 'number' ? value.toFixed(2) : value}`} />
              </PieChartIcon>
            </ResponsiveContainer>
          </div>
        )}
        {expenseByCategory.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChartIcon>
                <Pie data={expenseByCategory} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#ef4444" dataKey="value">
                  {expenseByCategory.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[entry.name as keyof typeof categoryColors] || '#ef4444'} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${typeof value === 'number' ? value.toFixed(2) : value}`} />
              </PieChartIcon>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
                <th className="text-left py-3 px-4 font-semibold">Description</th>
                <th className="text-right py-3 px-4 font-semibold">Amount</th>
                <th className="text-center py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <AlertCircle className="inline mr-2" size={20}/>
                    No transactions yet. Add one to get started!
                  </td>
                </tr>
              ) : (
                entries.map(entry => (
                  <tr key={entry.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-4 text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.type === 'income' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                        entry.type === 'expense' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                        entry.type === 'asset' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                        'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{entry.category}</td>
                    <td className="py-3 px-4">{entry.description}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      <span className={entry.type === 'income' || entry.type === 'asset' ? 'text-green-600' : 'text-red-600'}>
                        {entry.type === 'expense' || entry.type === 'liability' ? '-' : '+'}${entry.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => deleteEntry(entry.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
