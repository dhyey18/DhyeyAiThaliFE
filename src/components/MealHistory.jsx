import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Trash2, Calendar, Search, Download } from 'lucide-react';
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
          Meal History
        </h2>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const startDate = filterDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const endDate = new Date().toISOString().split('T')[0];
                const response = await axios.get(`${API_BASE}/meals/export/csv`, {
                  params: { startDate, endDate },
                  responseType: 'blob'
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `meals-export-${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (error) {
                console.error('Error exporting:', error);
                alert('Failed to export data');
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-2 sm:px-3 py-1.5 sm:py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-xs sm:text-sm flex-1 sm:flex-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="px-2 sm:px-3 py-1.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-xs sm:text-sm whitespace-nowrap transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {filteredMeals.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>No meals found</p>
          {searchTerm && <p className="text-sm mt-2">Try a different search term</p>}
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer touch-manipulation"
              onClick={() => onSelectMeal && onSelectMeal(meal)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{formatDate(meal.createdAt)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-1 sm:mb-2">
                    <span className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400">
                      {meal.total_calories?.toFixed(0) || 0} kcal
                    </span>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {meal.items?.length || 0} items
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>P: {meal.macros_summary?.protein?.toFixed(1) || 0}g</span>
                    <span>C: {meal.macros_summary?.carbs?.toFixed(1) || 0}g</span>
                    <span>F: {meal.macros_summary?.fats?.toFixed(1) || 0}g</span>
                  </div>
                  {meal.items && meal.items.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {meal.items.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs truncate max-w-[100px] sm:max-w-none"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                      ))}
                      {meal.items.length > 3 && (
                        <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
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
                  className="p-1.5 sm:p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
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

