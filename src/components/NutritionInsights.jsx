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
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-xl w-1/3"></div>
          <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            Nutrition Insights
          </h2>
          <div className="flex gap-2">
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="select text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
            </select>
            <button
              onClick={loadInsights}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {insights.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
            <p>Not enough data to generate insights</p>
            <p className="text-sm mt-2">Start logging meals to see personalized insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-yellow-50 to-primary-50 dark:from-yellow-900/20 dark:to-primary-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
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

