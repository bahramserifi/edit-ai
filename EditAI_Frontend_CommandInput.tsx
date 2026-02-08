import { useState } from 'react';
import { useEditPlanStore } from '../store/editPlanStore';
import { useAuthStore } from '../store/authStore';
import { Send, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommandInput() {
  const [command, setCommand] = useState('');
  const { generatePlan, isLoading } = useEditPlanStore();
  const { user } = useAuthStore();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!command.trim()) {
      setError('Please enter a command');
      return;
    }

    if (command.length > 1000) {
      setError('Command is too long (max 1000 characters)');
      return;
    }

    try {
      await generatePlan(command);
      setCommand('');
      toast.success('Edit plan generated!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate plan';
      setError(message);
      toast.error(message);
    }
  };

  const examples = [
    'Cut this scene from 0:12 to 0:18',
    'Add bold yellow captions for the dialogue',
    'Show a flight animation from Istanbul to Antalya',
    'Make it energetic with fast cuts',
  ];

  return (
    <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe your video edit
          </label>
          <textarea
            value={command}
            onChange={(e) => {
              setCommand(e.target.value);
              setError('');
            }}
            placeholder="e.g., 'Cut this scene, add bold yellow captions, make it energetic'"
            className="w-full p-4 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            disabled={isLoading}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              {command.length} / 1000 characters
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !command.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
          {isLoading ? 'Generating...' : 'Generate Edit Plan'}
        </button>
      </form>

      {/* Examples */}
      <div className="mt-6 pt-6 border-t border-slate-600">
        <p className="text-sm font-medium text-gray-300 mb-3">Example commands:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => setCommand(example)}
              className="text-left p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-600 rounded text-sm text-gray-300 hover:text-gray-200 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
