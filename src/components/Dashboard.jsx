import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfDay, isToday } from 'date-fns';
import { TrendingUp, Calendar, Utensils } from 'lucide-react';
import { API_BASE } from '../config';

const Dashboard = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const CALORIE_GOAL = 2000;

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/history`);
      setMeals(response.data.meals || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDailyCalories = () => {
    const dailyData = {};
    meals.forEach(meal => {
      const date = format(new Date(meal.timestamp || meal.createdAt), 'yyyy-MM-dd');
      if (!dailyData[date]) {
        dailyData[date] = {
          date: format(new Date(meal.timestamp || meal.createdAt), 'MMM dd'),
          calories: 0,
          goal: CALORIE_GOAL
        };
      }
      dailyData[date].calories += meal.total_calories || 0;
    });
    return Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getTodayMacros = () => {
    const today = startOfDay(new Date());
    const todayMeals = meals.filter(meal => {
      const mealDate = startOfDay(new Date(meal.timestamp || meal.createdAt));
      return isToday(mealDate);
    });

    const macros = todayMeals.reduce((acc, meal) => ({
      protein: acc.protein + (meal.macros_summary?.protein || 0),
      carbs: acc.carbs + (meal.macros_summary?.carbs || 0),
      fats: acc.fats + (meal.macros_summary?.fats || 0)
    }), { protein: 0, carbs: 0, fats: 0 });

    const total = macros.protein + macros.carbs + macros.fats;
    if (total === 0) return [];

    return [
      { name: 'Protein', value: Math.round(macros.protein), color: '#3b82f6' },
      { name: 'Carbs', value: Math.round(macros.carbs), color: '#22c55e' },
      { name: 'Fats', value: Math.round(macros.fats), color: '#a855f7' }
    ];
  };

  const dailyCaloriesData = getDailyCalories();
  const todayMacrosData = getTodayMacros();

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

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Analytics Dashboard</h2>
        </div>

        {dailyCaloriesData.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
            <p>No meal data available</p>
            <p className="text-sm mt-2">Start analyzing meals to see your nutrition trends</p>
          </div>
        ) : (
            <>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Daily Calories vs Goal
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyCaloriesData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="calories" fill="#f97316" name="Calories" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="goal" fill="#e5e7eb" name="Goal (2000)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {todayMacrosData.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                  Today's Macronutrient Split
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={todayMacrosData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value}g`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {todayMacrosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e5e7eb' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>

      <div className="card p-6">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Recent Meal History
        </h3>
        {meals.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            <p className="text-base">No meals found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {meals.slice(0, 10).map((meal) => (
              <div
                key={meal.id}
                className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {format(new Date(meal.timestamp || meal.createdAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs font-medium whitespace-nowrap">
                        {meal.mealType || 'Meal'}
                      </span>
                      {meal.dietaryPreference && meal.dietaryPreference !== 'Standard' && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium whitespace-nowrap">
                          {meal.dietaryPreference}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                      <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                        {meal.total_calories?.toFixed(0) || 0} kcal
                      </span>
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {meal.items?.length || 0} items
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                      <span>P: {meal.macros_summary?.protein?.toFixed(1) || 0}g</span>
                      <span>C: {meal.macros_summary?.carbs?.toFixed(1) || 0}g</span>
                      <span>F: {meal.macros_summary?.fats?.toFixed(1) || 0}g</span>
                    </div>
                    {meal.items && meal.items.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {meal.items.slice(0, 3).map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs truncate max-w-[120px] sm:max-w-none"
                            title={item.name}
                          >
                            {item.name}
                          </span>
                        ))}
                        {meal.items.length > 3 && (
                          <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-lg text-xs">
                            +{meal.items.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

