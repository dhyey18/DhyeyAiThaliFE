import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Trash2, Plus, Clock } from 'lucide-react';
import { API_BASE } from '../config';

const MealFavorites = ({ onSelectMeal, onSave, currentMeal }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteName, setFavoriteName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/favorites`);
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async () => {
    if (!currentMeal || !favoriteName.trim()) {
      alert('Please enter a name for this favorite meal');
      return;
    }

    try {
      await axios.post(`${API_BASE}/favorites`, {
        name: favoriteName,
        items: currentMeal.items || [],
        totalCalories: currentMeal.total_calories || currentMeal.totalCalories || 0,
        macros_summary: currentMeal.macros_summary || currentMeal.macros || {},
        mealType: currentMeal.mealType || 'Lunch',
        dietaryPreference: currentMeal.dietaryPreference || 'Standard'
      });
      alert('Favorite meal saved!');
      setFavoriteName('');
      setShowAddForm(false);
      loadFavorites();
    } catch (error) {
      console.error('Error saving favorite:', error);
      alert('Failed to save favorite');
    }
  };

  const handleDeleteFavorite = async (id) => {
    if (!window.confirm('Delete this favorite meal?')) return;
    
    try {
      await axios.delete(`${API_BASE}/favorites/${id}`);
      loadFavorites();
    } catch (error) {
      console.error('Error deleting favorite:', error);
      alert('Failed to delete favorite');
    }
  };

  const handleUseFavorite = async (favorite) => {
    try {
      await axios.post(`${API_BASE}/meals/quick-add`, {
        items: favorite.items || [],
        total_calories: favorite.totalCalories || 0,
        macros_summary: {
          protein: favorite.macros?.protein || 0,
          carbs: favorite.macros?.carbs || 0,
          fats: favorite.macros?.fats || 0
        },
        mealType: favorite.mealType || 'Lunch',
        dietaryPreference: favorite.dietaryPreference || 'Standard',
        advice: `Quick added from favorites: ${favorite.name}`
      });
      alert('Meal logged successfully!');
      if (onSave) onSave();
    } catch (error) {
      console.error('Error using favorite:', error);
      alert('Failed to log meal');
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            Favorite Meals
          </h2>
          {currentMeal && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Current Meal
            </button>
          )}
        </div>

        {showAddForm && currentMeal && (
          <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name this favorite meal
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={favoriteName}
                onChange={(e) => setFavoriteName(e.target.value)}
                placeholder="e.g., My Usual Lunch"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={handleAddFavorite}
                className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFavoriteName('');
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Star className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>No favorite meals yet</p>
            <p className="text-sm mt-2">Analyze a meal and save it as a favorite for quick access</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((favorite) => (
              <div
                key={favorite._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-1">{favorite.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{favorite.mealType}</span>
                      {favorite.dietaryPreference !== 'Standard' && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                          {favorite.dietaryPreference}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFavorite(favorite._id)}
                    className="p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-3">
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {favorite.totalCalories?.toFixed(0) || 0} kcal
                  </p>
                  <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <span>P: {favorite.macros?.protein?.toFixed(1) || 0}g</span>
                    <span>C: {favorite.macros?.carbs?.toFixed(1) || 0}g</span>
                    <span>F: {favorite.macros?.fats?.toFixed(1) || 0}g</span>
                  </div>
                </div>

                {favorite.items && favorite.items.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {favorite.items.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs"
                      >
                        {item.name}
                      </span>
                    ))}
                    {favorite.items.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        +{favorite.items.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleUseFavorite(favorite)}
                  className="w-full px-3 py-2 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors text-sm font-medium"
                >
                  Use This Meal
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealFavorites;

