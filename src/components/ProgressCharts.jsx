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
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-xl w-1/3"></div>
          <div className="h-64 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
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
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            Nutrition Trends
          </h2>
          <div className="flex gap-2">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-all duration-200 touch-manipulation ${
                  days === d
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
            <p className="text-base">No data available for the selected period</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Daily Calories</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-4">Macros Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="protein" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="carbs" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="fats" fill="#a855f7" radius={[8, 8, 0, 0]} />
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

