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
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-xl w-1/3"></div>
          <div className="h-32 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="card p-6 text-center">
        <p className="text-neutral-500 dark:text-neutral-400">No data available</p>
      </div>
    );
  }

  const dailyBreakdown = Object.entries(summary.dailyBreakdown || {}).sort((a, b) => 
    new Date(a[0]) - new Date(b[0])
  );

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            Weekly Summary
          </h2>
          <div className="flex gap-2">
            <input
              type="date"
              value={weekStart}
              onChange={(e) => setWeekStart(e.target.value)}
              className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm"
            />
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-medium card-hover">
            <p className="text-sm opacity-90 mb-1">Total Meals</p>
            <p className="text-3xl font-bold">{summary.totalMeals}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-medium card-hover">
            <p className="text-sm opacity-90 mb-1">Total Calories</p>
            <p className="text-3xl font-bold">{summary.totalCalories.toFixed(0)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-medium card-hover">
            <p className="text-sm opacity-90 mb-1">Avg Daily Calories</p>
            <p className="text-3xl font-bold">{summary.avgDailyCalories}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-medium card-hover">
            <p className="text-sm opacity-90 mb-1">Total Protein</p>
            <p className="text-3xl font-bold">{summary.totalProtein.toFixed(0)}g</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
              <thead className="bg-neutral-50 dark:bg-neutral-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Meals</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Calories</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Protein</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Carbs</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Fats</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                {dailyBreakdown.map(([date, data]) => (
                  <tr key={date} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100">{new Date(date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 text-right">{data.mealCount}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 text-right font-medium">{data.calories.toFixed(0)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 text-right">{data.protein.toFixed(1)}g</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 text-right">{data.carbs.toFixed(1)}g</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 text-right">{data.fats.toFixed(1)}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Meal Type Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(summary.mealTypeBreakdown || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{type}</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{count} meals</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Dietary Preference Breakdown</h3>
            <div className="space-y-2">
              {Object.entries(summary.dietaryPreferenceBreakdown || {}).map(([pref, count]) => (
                <div key={pref} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{pref}</span>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{count} meals</span>
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

