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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700 text-center transition-colors">
        <p className="text-gray-500 dark:text-gray-400">Upload an image to see nutrition analysis</p>
      </div>
    );
  }

  const { items = [], total_calories = 0, macros_summary = {}, advice = '' } = data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Total Calories</h2>
            <p className="text-4xl sm:text-5xl font-bold">{total_calories.toFixed(0)}</p>
            <p className="text-orange-100 mt-1 sm:mt-2 text-sm sm:text-base">kcal</p>
          </div>
          {data && (
            <div className="flex gap-1.5 sm:gap-2 ml-2 flex-shrink-0">
              <button
                onClick={handleSave}
                className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors touch-manipulation"
                title="Save Meal"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleExport}
                className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors touch-manipulation"
                title="Export JSON"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors touch-manipulation"
                title="Share"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Protein</h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {macros_summary.protein?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">grams</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Carbs</h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {macros_summary.carbs?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">grams</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
            <Apple className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-orange-400 flex-shrink-0" />
            <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Fats</h3>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            {macros_summary.fats?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">grams</p>
        </div>
      </div>

      {items && items.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">Food Items</h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Item</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Cal</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">P</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">C</th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">F</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-right">{item.calories?.toFixed(0) || '0'}</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-right">{item.protein?.toFixed(1) || '0.0'}g</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-right">{item.carbs?.toFixed(1) || '0.0'}g</td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-right">{item.fats?.toFixed(1) || '0.0'}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {advice && (
        <div className="bg-gradient-to-r from-green-50 to-orange-50 dark:from-green-900/20 dark:to-orange-900/20 rounded-xl shadow-sm p-4 sm:p-6 border border-green-200 dark:border-green-800 transition-colors">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            <span className="text-green-600 dark:text-green-400">💡</span>
            AI Nutrition Advice
          </h3>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">{advice}</p>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;

