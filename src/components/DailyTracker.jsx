import { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, TrendingUp, Edit2, Save } from 'lucide-react';
import { API_BASE } from '../config';

const DailyTracker = ({ meals = [] }) => {
  const [goals, setGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65
  });
  const [editing, setEditing] = useState(false);
  const [tempGoals, setTempGoals] = useState(goals);

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [meals, goals]);

  const loadGoals = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`${API_BASE}/tracker`, {
        params: { date: today }
      });
      if (response.data.tracker?.goals) {
        setGoals(response.data.tracker.goals);
        setTempGoals(response.data.tracker.goals);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoals = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await axios.post(`${API_BASE}/tracker`, {
        date: today,
        goals: tempGoals
      });
      setGoals(tempGoals);
      setEditing(false);
    } catch (error) {
      console.error('Error saving goals:', error);
      alert('Failed to save goals');
    }
  };

  const calculateProgress = () => {
    const today = new Date().toDateString();
    const todayMeals = meals.filter(meal => 
      new Date(meal.createdAt).toDateString() === today
    );

    const consumed = todayMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.total_calories || 0),
      protein: acc.protein + (meal.macros_summary?.protein || 0),
      carbs: acc.carbs + (meal.macros_summary?.carbs || 0),
      fats: acc.fats + (meal.macros_summary?.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    return {
      consumed,
      percentages: {
        calories: Math.min((consumed.calories / goals.calories) * 100, 100),
        protein: Math.min((consumed.protein / goals.protein) * 100, 100),
        carbs: Math.min((consumed.carbs / goals.carbs) * 100, 100),
        fats: Math.min((consumed.fats / goals.fats) * 100, 100)
      }
    };
  };

  const progress = calculateProgress();

  const ProgressBar = ({ label, consumed, goal, percentage, unit, color }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">
          {consumed.toFixed(1)} / {goal} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{percentage.toFixed(1)}% of goal</span>
        <span>{goal - consumed > 0 ? `${(goal - consumed).toFixed(1)} ${unit} remaining` : 'Goal achieved!'}</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          Daily Nutrition Goals
        </h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base touch-manipulation"
          >
            <Edit2 className="w-4 h-4" />
            Edit Goals
          </button>
        ) : (
          <button
            onClick={saveGoals}
            className="flex items-center justify-center gap-2 px-3 py-2 sm:py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base touch-manipulation"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={tempGoals.calories}
                onChange={(e) => setTempGoals({ ...tempGoals, calories: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                value={tempGoals.protein}
                onChange={(e) => setTempGoals({ ...tempGoals, protein: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                value={tempGoals.carbs}
                onChange={(e) => setTempGoals({ ...tempGoals, carbs: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fats (g)
              </label>
              <input
                type="number"
                value={tempGoals.fats}
                onChange={(e) => setTempGoals({ ...tempGoals, fats: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <button
            onClick={() => {
              setTempGoals(goals);
              setEditing(false);
            }}
            className="w-full px-4 py-2 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 touch-manipulation"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <ProgressBar
            label="Calories"
            consumed={progress.consumed.calories}
            goal={goals.calories}
            percentage={progress.percentages.calories}
            unit="kcal"
            color="bg-gradient-to-r from-orange-500 to-orange-600"
          />
          <ProgressBar
            label="Protein"
            consumed={progress.consumed.protein}
            goal={goals.protein}
            percentage={progress.percentages.protein}
            unit="g"
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <ProgressBar
            label="Carbs"
            consumed={progress.consumed.carbs}
            goal={goals.carbs}
            percentage={progress.percentages.carbs}
            unit="g"
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <ProgressBar
            label="Fats"
            consumed={progress.consumed.fats}
            goal={goals.fats}
            percentage={progress.percentages.fats}
            unit="g"
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>
            {meals.filter(m => new Date(m.createdAt).toDateString() === new Date().toDateString()).length} meals logged today
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyTracker;

