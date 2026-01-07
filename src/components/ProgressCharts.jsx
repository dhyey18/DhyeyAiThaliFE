import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { API_BASE } from '../config';

const ProgressCharts = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadStats();
  }, [days]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/meals/stats`, {
        params: { days }
      });
      setStats(response.data.stats || []);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = stats.map(stat => ({
    date: formatDate(stat.date),
    calories: Math.round(stat.totalCalories),
    protein: Math.round(stat.totalProtein),
    carbs: Math.round(stat.totalCarbs),
    fats: Math.round(stat.totalFats)
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
            Nutrition Trends
          </h2>
          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg text-xs sm:text-sm transition-colors touch-manipulation ${
                  days === d
                    ? 'bg-orange-600 dark:bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm sm:text-base">No data available for the selected period</p>
          </div>
        ) : (
          <>
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">Daily Calories</h3>
              <ResponsiveContainer width="100%" height={220} className="sm:h-[250px]">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4">Macros Breakdown</h3>
              <ResponsiveContainer width="100%" height={220} className="sm:h-[250px]">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="protein" fill="#3b82f6" />
                  <Bar dataKey="carbs" fill="#22c55e" />
                  <Bar dataKey="fats" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressCharts;

