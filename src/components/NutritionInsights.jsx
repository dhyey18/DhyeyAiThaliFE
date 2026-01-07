import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, RotateCcw } from 'lucide-react';
import { API_BASE } from '../config';

const NutritionInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadInsights();
  }, [days]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/meals/insights`, {
        params: { days }
      });
      setInsights(response.data.insights || []);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            Nutrition Insights
          </h2>
          <div className="flex gap-2">
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
            </select>
            <button
              onClick={loadInsights}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {insights.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>Not enough data to generate insights</p>
            <p className="text-sm mt-2">Start logging meals to see personalized insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 How Insights Work</h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Our AI analyzes your meal patterns over the selected time period to provide personalized nutrition insights. 
          These insights help you understand your eating habits and make informed decisions about your diet.
        </p>
      </div>
    </div>
  );
};

export default NutritionInsights;

