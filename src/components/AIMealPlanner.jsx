import { useState } from 'react';
import axios from 'axios';
import { Calendar, ChefHat, Clock, Utensils, Download, RefreshCw, Sparkles } from 'lucide-react';
import { API_BASE } from '../config';

const AIMealPlanner = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    dietaryPreference: 'Standard',
    calorieGoal: 2000,
    days: 7,
    mealsPerDay: 3
  });
  const [selectedDay, setSelectedDay] = useState(0);

  const generatePlan = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/ai/meal-plan`, settings);
      setMealPlan(response.data);
      setSelectedDay(0);
    } catch (error) {
      console.error('Error generating meal plan:', error);
      alert('Failed to generate meal plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const exportPlan = () => {
    if (!mealPlan) return;
    const dataStr = JSON.stringify(mealPlan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meal-plan-${settings.dietaryPreference}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getMealTypeColor = (type) => {
    switch (type) {
      case 'Breakfast': return 'from-yellow-400 to-orange-400';
      case 'Lunch': return 'from-green-400 to-teal-400';
      case 'Dinner': return 'from-blue-400 to-indigo-400';
      case 'Snack': return 'from-pink-400 to-purple-400';
      default: return 'from-neutral-400 to-neutral-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">AI Meal Planner</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Generate personalized weekly meal plans</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Dietary Preference
            </label>
            <select
              value={settings.dietaryPreference}
              onChange={(e) => setSettings({ ...settings, dietaryPreference: e.target.value })}
              className="select w-full"
            >
              <option value="Standard">Standard</option>
              <option value="Jain">Jain</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
              <option value="High Protein">High Protein</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Daily Calories
            </label>
            <input
              type="number"
              value={settings.calorieGoal}
              onChange={(e) => setSettings({ ...settings, calorieGoal: parseInt(e.target.value) })}
              className="input w-full"
              min="1200"
              max="4000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Days
            </label>
            <select
              value={settings.days}
              onChange={(e) => setSettings({ ...settings, days: parseInt(e.target.value) })}
              className="select w-full"
            >
              <option value={3}>3 Days</option>
              <option value={5}>5 Days</option>
              <option value={7}>7 Days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Meals/Day
            </label>
            <select
              value={settings.mealsPerDay}
              onChange={(e) => setSettings({ ...settings, mealsPerDay: parseInt(e.target.value) })}
              className="select w-full"
            >
              <option value={2}>2 Meals</option>
              <option value={3}>3 Meals</option>
              <option value={4}>4 Meals</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={generatePlan}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Meal Plan
              </>
            )}
          </button>
          {mealPlan && (
            <button
              onClick={exportPlan}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl transition-colors"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-white animate-bounce" />
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            AI is preparing your personalized meal plan...
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
            This may take a few seconds
          </p>
        </div>
      )}

      {/* Meal Plan Display */}
      {!loading && mealPlan && mealPlan.mealPlan && (
        <>
          {/* Day Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {mealPlan.mealPlan.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedDay === idx
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                }`}
              >
                <span className="text-xs">{day.dayName}</span>
              </button>
            ))}
          </div>

          {/* Selected Day Meals */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {mealPlan.mealPlan[selectedDay]?.dayName}
              </h3>
              {mealPlan.mealPlan[selectedDay]?.dailyTotals && (
                <div className="flex gap-4 text-sm">
                  <span className="text-orange-600 dark:text-orange-400 font-semibold">
                    {mealPlan.mealPlan[selectedDay].dailyTotals.calories} kcal
                  </span>
                  <span className="text-neutral-500 hidden sm:inline">
                    P: {mealPlan.mealPlan[selectedDay].dailyTotals.protein}g |
                    C: {mealPlan.mealPlan[selectedDay].dailyTotals.carbs}g |
                    F: {mealPlan.mealPlan[selectedDay].dailyTotals.fats}g
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {mealPlan.mealPlan[selectedDay]?.meals?.map((meal, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl hover:shadow-md transition-shadow animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getMealTypeColor(meal.type)} flex items-center justify-center`}>
                        <Utensils className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                          {meal.type}
                        </span>
                        <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                          {meal.name}
                        </h4>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-orange-500">{meal.calories} kcal</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {meal.items?.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300 rounded-lg text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex gap-4">
                      <span>P: {meal.protein}g</span>
                      <span>C: {meal.carbs}g</span>
                      <span>F: {meal.fats}g</span>
                    </div>
                    {meal.prepTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meal.prepTime}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Overview & Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealPlan.weeklyOverview && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Weekly Overview
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Avg Daily Calories</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {mealPlan.weeklyOverview.avgDailyCalories} kcal
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Avg Daily Protein</span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {mealPlan.weeklyOverview.avgDailyProtein}g
                    </span>
                  </div>
                </div>
              </div>
            )}

            {mealPlan.tips && mealPlan.tips.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  💡 Meal Prep Tips
                </h3>
                <ul className="space-y-2">
                  {mealPlan.tips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                      <span className="text-primary-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty State */}
      {!loading && !mealPlan && (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
          <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            No Meal Plan Yet
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400">
            Configure your preferences above and click "Generate Meal Plan"
          </p>
        </div>
      )}
    </div>
  );
};

export default AIMealPlanner;
