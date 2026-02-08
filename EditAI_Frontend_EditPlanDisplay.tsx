import { EditPlan } from '../types';
import { Download, Copy, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface EditPlanDisplayProps {
  plan: EditPlan;
}

export default function EditPlanDisplay({ plan }: EditPlanDisplayProps) {
  const [exportFormat, setExportFormat] = useState<'json' | 'pdf' | 'text'>('json');

  const handleExport = async (format: 'json' | 'pdf' | 'text') => {
    try {
      if (format === 'json') {
        const dataStr = JSON.stringify(plan, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${plan.title}-edit-plan.json`;
        link.click();
        toast.success('JSON exported!');
      } else if (format === 'text') {
        const text = formatPlanAsText(plan);
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      } else if (format === 'pdf') {
        // PDF export would require a library like jsPDF
        toast.success('PDF export coming soon!');
      }
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const formatPlanAsText = (plan: EditPlan): string => {
    let text = `EDIT PLAN: ${plan.title}\n`;
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `\n${'='.repeat(50)}\n\n`;

    text += `SCENES:\n`;
    plan.scenes.forEach((scene, i) => {
      text += `${i + 1}. ${scene.start_time} → ${scene.end_time}\n`;
      text += `   Action: ${scene.action}\n`;
      if (scene.reason) text += `   Reason: ${scene.reason}\n`;
    });

    text += `\n${'='.repeat(50)}\n\n`;
    text += `CAPTIONS:\n`;
    plan.captions.forEach((caption, i) => {
      text += `${i + 1}. [${caption.time}] ${caption.text}\n`;
      text += `   Style: ${caption.style} | Duration: ${caption.duration}\n`;
    });

    text += `\n${'='.repeat(50)}\n\n`;
    text += `ANIMATIONS:\n`;
    plan.animations.forEach((anim, i) => {
      text += `${i + 1}. ${anim.type}\n`;
      text += `   Duration: ${anim.duration} | Timing: ${anim.timing}\n`;
    });

    return text;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{plan.title}</h2>
            <p className="text-gray-400">
              Generated {new Date(plan.created_at || '').toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
            <button
              onClick={() => handleExport('text')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Scenes */}
      <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Scenes ({plan.scenes.length})
        </h3>
        <div className="space-y-3">
          {plan.scenes.map((scene, idx) => (
            <div
              key={scene.id}
              className="p-4 bg-slate-800/50 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-mono text-sm text-gray-400">
                    Scene {idx + 1}
                  </p>
                  <p className="text-gray-300 font-medium">
                    {scene.start_time} → {scene.end_time}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  scene.action === 'KEEP'
                    ? 'bg-green-500/20 text-green-400'
                    : scene.action === 'CUT'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {scene.action}
                </span>
              </div>
              {scene.reason && (
                <p className="text-sm text-gray-400">💡 {scene.reason}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Captions */}
      {plan.captions.length > 0 && (
        <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Captions ({plan.captions.length})
          </h3>
          <div className="space-y-3">
            {plan.captions.map((caption) => (
              <div
                key={caption.id}
                className="p-4 bg-slate-800/50 border border-slate-600 rounded-lg"
              >
                <p className="text-white font-medium mb-2">"{caption.text}"</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>⏱️ {caption.time}</span>
                  <span>⏳ {caption.duration}</span>
                  <span>🎨 {caption.style}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Animations */}
      {plan.animations.length > 0 && (
        <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Animations ({plan.animations.length})
          </h3>
          <div className="space-y-3">
            {plan.animations.map((anim) => (
              <div
                key={anim.id}
                className="p-4 bg-slate-800/50 border border-slate-600 rounded-lg"
              >
                <p className="text-white font-medium mb-2">✨ {anim.type}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>⏳ {anim.duration}</span>
                  <span>🎬 {anim.timing}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transitions */}
      {plan.transitions && plan.transitions.length > 0 && (
        <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Transitions ({plan.transitions.length})
          </h3>
          <div className="space-y-3">
            {plan.transitions.map((trans) => (
              <div
                key={trans.id}
                className="p-4 bg-slate-800/50 border border-slate-600 rounded-lg"
              >
                <p className="text-white font-medium">🔄 {trans.type}</p>
                <p className="text-sm text-gray-400">Duration: {trans.duration}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
