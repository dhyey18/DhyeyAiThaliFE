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
      <div className="card p-6 card-hover">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Star className="w-6 h-6 text-primary-600 dark:text-primary-400 fill-primary-600 dark:fill-primary-400" />
            Favorite Meals
          </h2>
          {currentMeal && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Current Meal
            </button>
          )}
        </div>

        {showAddForm && currentMeal && (
          <div className="mb-6 p-5 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800 shadow-medium animate-slide-up">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
              Name this favorite meal
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={favoriteName}
                onChange={(e) => setFavoriteName(e.target.value)}
                placeholder="e.g., My Usual Lunch"
                className="input flex-1"
              />
              <button
                onClick={handleAddFavorite}
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFavoriteName('');
                }}
                className="btn-secondary px-5 py-2.5"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 dark:text-neutral-400">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-700 mb-4">
              <Star className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
            </div>
            <p className="text-lg font-semibold mb-2">No favorite meals yet</p>
            <p className="text-sm text-neutral-400 dark:text-neutral-500">Analyze a meal and save it as a favorite for quick access</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((favorite) => (
              <div
                key={favorite._id}
                className="group card p-5 card-hover border-2 border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-2 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                      {favorite.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <Clock className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
                      <span className="font-medium">{favorite.mealType}</span>
                      {favorite.dietaryPreference !== 'Standard' && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-medium">
                          {favorite.dietaryPreference}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteFavorite(favorite._id)}
                    className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                    title="Delete favorite"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/10 rounded-xl border border-primary-200 dark:border-primary-800/30">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {favorite.totalCalories?.toFixed(0) || 0} <span className="text-sm font-normal">kcal</span>
                  </p>
                  <div className="flex gap-4 text-xs text-neutral-600 dark:text-neutral-400 mt-2">
                    <span className="font-semibold">P: <span className="font-normal">{favorite.macros?.protein?.toFixed(1) || 0}g</span></span>
                    <span className="font-semibold">C: <span className="font-normal">{favorite.macros?.carbs?.toFixed(1) || 0}g</span></span>
                    <span className="font-semibold">F: <span className="font-normal">{favorite.macros?.fats?.toFixed(1) || 0}g</span></span>
                  </div>
                </div>

                {favorite.items && favorite.items.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {favorite.items.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-xs font-medium border border-primary-200 dark:border-primary-800/30"
                      >
                        {item.name}
                      </span>
                    ))}
                    {favorite.items.length > 3 && (
                      <span className="px-2.5 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 rounded-full text-xs font-medium border border-neutral-200 dark:border-neutral-600">
                        +{favorite.items.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleUseFavorite(favorite)}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
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

