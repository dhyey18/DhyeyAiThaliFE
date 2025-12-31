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
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        </div>

        {dailyCaloriesData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No meal data available</p>
            <p className="text-sm mt-2">Start analyzing meals to see your nutrition trends</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Daily Calories vs Goal
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyCaloriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calories" fill="#f97316" name="Calories Consumed" />
                  <Bar dataKey="goal" fill="#e5e7eb" name="Daily Goal (2000)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {todayMacrosData.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Today's Macronutrient Split
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={todayMacrosData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value}g (${(percent * 100).toFixed(1)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {todayMacrosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-600" />
          Recent Meal History
        </h3>
        {meals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No meals found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {meals.slice(0, 10).map((meal) => (
              <div
                key={meal.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {format(new Date(meal.timestamp || meal.createdAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                        {meal.mealType || 'Meal'}
                      </span>
                      {meal.dietaryPreference && meal.dietaryPreference !== 'Standard' && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {meal.dietaryPreference}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xl font-bold text-orange-600">
                        {meal.total_calories?.toFixed(0) || 0} kcal
                      </span>
                      <span className="text-sm text-gray-600">
                        {meal.items?.length || 0} items
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>P: {meal.macros_summary?.protein?.toFixed(1) || 0}g</span>
                      <span>C: {meal.macros_summary?.carbs?.toFixed(1) || 0}g</span>
                      <span>F: {meal.macros_summary?.fats?.toFixed(1) || 0}g</span>
                    </div>
                    {meal.items && meal.items.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {meal.items.slice(0, 4).map((item, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs"
                          >
                            {item.name}
                          </span>
                        ))}
                        {meal.items.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{meal.items.length - 4} more
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

