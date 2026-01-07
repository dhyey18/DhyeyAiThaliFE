import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, Calendar } from 'lucide-react';
import { API_BASE } from '../config';

const WeeklySummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState('');

  useEffect(() => {
    loadSummary();
  }, [weekStart]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const params = weekStart ? { weekStart } : {};
      const response = await axios.get(`${API_BASE}/meals/weekly-summary`, { params });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const startDate = weekStart || summary.weekStart;
      const endDate = summary.weekEnd;
      const response = await axios.get(`${API_BASE}/meals/export/csv`, {
        params: { startDate, endDate },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `weekly-summary-${startDate}-${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const dailyBreakdown = Object.entries(summary.dailyBreakdown || {}).sort((a, b) => 
    new Date(a[0]) - new Date(b[0])
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            Weekly Summary
          </h2>
          <div className="flex gap-2">
            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            />
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Total Meals</p>
            <p className="text-3xl font-bold">{summary.totalMeals}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Total Calories</p>
            <p className="text-3xl font-bold">{summary.totalCalories.toFixed(0)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Avg Daily Calories</p>
            <p className="text-3xl font-bold">{summary.avgDailyCalories}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Total Protein</p>
            <p className="text-3xl font-bold">{summary.totalProtein.toFixed(0)}g</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Meals</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Calories</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Protein</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Carbs</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fats</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dailyBreakdown.map(([date, data]) => (
                  <tr key={date} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{new Date(date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">{data.mealCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right font-medium">{data.calories.toFixed(0)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">{data.protein.toFixed(1)}g</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">{data.carbs.toFixed(1)}g</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">{data.fats.toFixed(1)}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Meal Type Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(summary.mealTypeBreakdown || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{count} meals</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Dietary Preference Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(summary.dietaryPreferenceBreakdown || {}).map(([pref, count]) => (
                <div key={pref} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{pref}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{count} meals</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;

