import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, RefreshCw, Star, Plus, ChefHat } from 'lucide-react';
import { API_BASE } from '../config';

const MealSuggestions = ({ onSave }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [dietaryPreference, setDietaryPreference] = useState('Standard');

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/ai/suggestions`, {
        params: { dietaryPreference }
      });
      setSuggestions(response.data.suggestions || []);
      setContext(response.data.context);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (suggestion) => {
    try {
      await axios.post(`${API_BASE}/meals/quick-add`, {
        items: [{ 
          name: suggestion.name, 
          calories: suggestion.calories,
          protein: suggestion.protein,
          carbs: suggestion.carbs,
          fats: suggestion.fats
        }],
        totalCalories: suggestion.calories,
        macros: {
          protein: suggestion.protein,
          carbs: suggestion.carbs,
          fats: suggestion.fats
        },
        mealType: context?.mealType || 'Meal',
        dietaryPreference,
        advice: `AI Suggested: ${suggestion.reason}`
      });
      if (onSave) onSave();
      alert('Meal added successfully!');
    } catch (error) {
      console.error('Error adding meal:', error);
      alert('Failed to add meal');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">AI Meal Suggestions</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">Personalized recommendations for you</p>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="select text-sm"
            >
              <option value="Standard">Standard</option>
              <option value="Jain">Jain</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
              <option value="High Protein">High Protein</option>
            </select>
            <button
              onClick={loadSuggestions}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {context && (
          <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              <ChefHat className="w-4 h-4 inline mr-1" />
              Suggesting for <strong>{context.mealType}</strong> • 
              Remaining: {context.remaining.calories} cal, {context.remaining.protein}g protein
            </p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-3/4 mb-3"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-full mb-2"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions Grid */}
      {!loading && suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="card p-6 hover:shadow-large transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex-1">
                  {suggestion.name}
                </h3>
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-primary-500 text-white text-sm font-bold rounded-full">
                  {suggestion.calories} kcal
                </span>
              </div>
              
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                {suggestion.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{suggestion.protein}g</p>
                  <p className="text-xs text-blue-500">Protein</p>
                </div>
                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{suggestion.carbs}g</p>
                  <p className="text-xs text-green-500">Carbs</p>
                </div>
                <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{suggestion.fats}g</p>
                  <p className="text-xs text-purple-500">Fats</p>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                  <Star className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {suggestion.reason}
                </p>
              </div>

              <button
                onClick={() => handleQuickAdd(suggestion)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add to Today
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && suggestions.length === 0 && (
        <div className="card p-12 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
          <p className="text-neutral-500 dark:text-neutral-400">No suggestions available</p>
          <button
            onClick={loadSuggestions}
            className="mt-4 px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default MealSuggestions;
