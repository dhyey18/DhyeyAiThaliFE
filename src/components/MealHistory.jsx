import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Trash2, Calendar, Search } from 'lucide-react';
import { API_BASE } from '../config';

const MealHistory = ({ onSelectMeal }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    loadMeals();
  }, [filterDate]);

  const loadMeals = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterDate) params.date = filterDate;
      params.limit = 50;
      
      const response = await axios.get(`${API_BASE}/meals`, { params });
      setMeals(response.data.meals || []);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (id) => {
    if (!window.confirm('Delete this meal record?')) return;
    
    try {
      await axios.delete(`${API_BASE}/meals/${id}`);
      loadMeals();
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Failed to delete meal');
    }
  };

  const filteredMeals = meals.filter(meal => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return meal.items?.some(item => 
        item.name?.toLowerCase().includes(searchLower)
      ) || false;
    }
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
          Meal History
        </h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-2 sm:px-3 py-1.5 sm:py-1 border border-gray-300 rounded-lg text-xs sm:text-sm flex-1 sm:flex-none"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="px-2 sm:px-3 py-1.5 sm:py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs sm:text-sm whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {filteredMeals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No meals found</p>
          {searchTerm && <p className="text-sm mt-2">Try a different search term</p>}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer touch-manipulation"
              onClick={() => onSelectMeal && onSelectMeal(meal)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{formatDate(meal.createdAt)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
                    <span className="text-base sm:text-lg font-bold text-orange-600">
                      {meal.total_calories?.toFixed(0) || 0} kcal
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {meal.items?.length || 0} items
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-500">
                    <span>P: {meal.macros_summary?.protein?.toFixed(1) || 0}g</span>
                    <span>C: {meal.macros_summary?.carbs?.toFixed(1) || 0}g</span>
                    <span>F: {meal.macros_summary?.fats?.toFixed(1) || 0}g</span>
                  </div>
                  {meal.items && meal.items.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {meal.items.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-100 text-orange-700 rounded text-xs truncate max-w-[100px] sm:max-w-none"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                      ))}
                      {meal.items.length > 3 && (
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{meal.items.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMeal(meal.id);
                  }}
                  className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealHistory;

