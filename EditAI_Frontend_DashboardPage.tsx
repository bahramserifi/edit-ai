import { useState, useEffect } from 'react';
import { useEditPlanStore } from '../store/editPlanStore';
import { useAuthStore } from '../store/authStore';
import CommandInput from '../components/CommandInput';
import EditPlanDisplay from '../components/EditPlanDisplay';
import EditPlanHistory from '../components/EditPlanHistory';
import { Loader } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { currentPlan, isLoading, plans, fetchPlans } = useEditPlanStore();
  const [activeTab, setActiveTab] = useState<'editor' | 'history'>('editor');

  useEffect(() => {
    fetchPlans();
  }, []);

  const usageLimit = user?.subscription_tier === 'free' ? 5 : Infinity;
  const plansUsedThisMonth = plans.filter(
    (p) => new Date(p.created_at).getMonth() === new Date().getMonth()
  ).length;

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'Creator'}!
          </h1>
          <p className="text-gray-400">
            Create professional video edit plans with AI
          </p>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Plans This Month</p>
            <p className="text-3xl font-bold text-white">
              {plansUsedThisMonth}
              <span className="text-lg text-gray-400 ml-2">
                / {usageLimit === Infinity ? '∞' : usageLimit}
              </span>
            </p>
          </div>

          <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Subscription</p>
            <p className="text-2xl font-bold text-blue-400 capitalize">
              {user?.subscription_tier}
            </p>
          </div>

          <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Plans</p>
            <p className="text-3xl font-bold text-white">{plans.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-600">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'editor'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Create New Plan
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            My Plans ({plans.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'editor' ? (
          <div className="space-y-8">
            {/* Command Input */}
            <CommandInput />

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-blue-400 animate-spin" />
                <span className="ml-3 text-gray-300">Generating edit plan...</span>
              </div>
            )}

            {/* Current Plan Display */}
            {currentPlan && !isLoading && <EditPlanDisplay plan={currentPlan} />}

            {/* Empty State */}
            {!currentPlan && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">
                  Enter a command above to generate your first edit plan
                </p>
                <p className="text-gray-500 text-sm">
                  Example: "Cut this scene, add bold yellow captions, make it energetic"
                </p>
              </div>
            )}
          </div>
        ) : (
          <EditPlanHistory plans={plans} />
        )}
      </div>
    </main>
  );
}
