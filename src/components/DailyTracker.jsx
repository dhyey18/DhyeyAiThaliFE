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
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{label}</span>
        <span className="text-sm text-neutral-600 dark:text-neutral-400">
          {consumed.toFixed(1)} / {goal} {unit}
        </span>
      </div>
      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color} shadow-sm`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>{percentage.toFixed(1)}% of goal</span>
        <span>{goal - consumed > 0 ? `${(goal - consumed).toFixed(1)} ${unit} remaining` : 'Goal achieved!'}</span>
      </div>
    </div>
  );

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
          Daily Nutrition Goals
        </h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="btn-secondary flex items-center justify-center gap-2 touch-manipulation"
          >
            <Edit2 className="w-4 h-4" />
            Edit Goals
          </button>
        ) : (
          <button
            onClick={saveGoals}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-xl hover:bg-green-700 dark:hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg touch-manipulation"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={tempGoals.calories}
                onChange={(e) => setTempGoals({ ...tempGoals, calories: parseInt(e.target.value) })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Protein (g)
              </label>
              <input
                type="number"
                value={tempGoals.protein}
                onChange={(e) => setTempGoals({ ...tempGoals, protein: parseInt(e.target.value) })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Carbs (g)
              </label>
              <input
                type="number"
                value={tempGoals.carbs}
                onChange={(e) => setTempGoals({ ...tempGoals, carbs: parseInt(e.target.value) })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                Fats (g)
              </label>
              <input
                type="number"
                value={tempGoals.fats}
                onChange={(e) => setTempGoals({ ...tempGoals, fats: parseInt(e.target.value) })}
                className="input"
              />
            </div>
          </div>
          <button
            onClick={() => {
              setTempGoals(goals);
              setEditing(false);
            }}
            className="w-full btn-secondary touch-manipulation"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <ProgressBar
            label="Calories"
            consumed={progress.consumed.calories}
            goal={goals.calories}
            percentage={progress.percentages.calories}
            unit="kcal"
            color="bg-gradient-to-r from-primary-500 to-primary-600"
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

      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
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

