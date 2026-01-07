import { Activity, Zap, Apple, Save, Download, Share2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../config';

const ResultsDashboard = ({ data, loading, onSave }) => {

  const handleSave = async () => {
    if (!data) return;
    try {
      await axios.post(`${API_BASE}/meals`, data);
      if (onSave) onSave();
      alert('Meal saved successfully!');
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Failed to save meal');
    }
  };

  const handleExport = () => {
    if (!data) return;
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `thali-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!data) return;
    const shareText = `My Thali Analysis:\nCalories: ${data.total_calories?.toFixed(0) || 0} kcal\nProtein: ${data.macros_summary?.protein?.toFixed(1) || 0}g\nCarbs: ${data.macros_summary?.carbs?.toFixed(1) || 0}g\nFats: ${data.macros_summary?.fats?.toFixed(1) || 0}g`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-xl w-1/2"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-3/4"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-1/2 mb-2"></div>
                <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="card p-12 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">Upload an image to see nutrition analysis</p>
      </div>
    );
  }

  const { items = [], total_calories = 0, macros_summary = {}, advice = '' } = data;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-large p-6 sm:p-8 text-white card-hover">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Total Calories</h2>
            <p className="text-5xl sm:text-6xl font-bold mb-2">{total_calories.toFixed(0)}</p>
            <p className="text-primary-100 text-base">kcal</p>
          </div>
          {data && (
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <button
                onClick={handleSave}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                title="Save Meal"
              >
                <Save className="w-5 h-5" />
              </button>
              <button
                onClick={handleExport}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                title="Export JSON"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 card-hover">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 truncate">Protein</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {macros_summary.protein?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">grams</p>
        </div>

        <div className="card p-4 card-hover">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 truncate">Carbs</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {macros_summary.carbs?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">grams</p>
        </div>

        <div className="card p-4 card-hover">
          <div className="flex items-center gap-2 mb-2">
            <Apple className="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 truncate">Fats</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {macros_summary.fats?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">grams</p>
        </div>
      </div>

      {items && items.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Food Items</h3>
          <div className="overflow-x-auto -mx-6">
            <div className="inline-block min-w-full align-middle px-6">
              <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Item</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Cal</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">P</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">C</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300">F</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.name}</td>
                      <td className="py-3 px-4 text-sm text-neutral-700 dark:text-neutral-300 text-right">{item.calories?.toFixed(0) || '0'}</td>
                      <td className="py-3 px-4 text-sm text-neutral-700 dark:text-neutral-300 text-right">{item.protein?.toFixed(1) || '0.0'}g</td>
                      <td className="py-3 px-4 text-sm text-neutral-700 dark:text-neutral-300 text-right">{item.carbs?.toFixed(1) || '0.0'}g</td>
                      <td className="py-3 px-4 text-sm text-neutral-700 dark:text-neutral-300 text-right">{item.fats?.toFixed(1) || '0.0'}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {advice && (
        <div className="bg-gradient-to-r from-green-50 to-primary-50 dark:from-green-900/20 dark:to-primary-900/20 rounded-2xl shadow-soft p-6 border border-green-200 dark:border-green-800 animate-fade-in">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">💡</span>
            AI Nutrition Advice
          </h3>
          <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">{advice}</p>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;

