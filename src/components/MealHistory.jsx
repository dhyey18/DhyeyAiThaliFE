import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Trash2, Calendar, Search, Download, AlertTriangle } from 'lucide-react';
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

  const deleteAllMeals = async () => {
    if (!window.confirm('Are you sure you want to delete ALL meals? This action cannot be undone.')) return;
    
    try {
      await axios.delete(`${API_BASE}/meals`);
      loadMeals();
      alert('All meals deleted successfully');
    } catch (error) {
      console.error('Error deleting all meals:', error);
      alert('Failed to delete all meals');
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
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-xl w-1/3"></div>
          <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
          <div className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          Meal History
        </h2>
        <div className="flex gap-2 flex-wrap">
          {meals.length > 0 && (
            <button
              onClick={deleteAllMeals}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
            >
              <AlertTriangle className="w-4 h-4" />
              Delete All
            </button>
          )}
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
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-xl text-sm bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="px-3 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-600 text-sm whitespace-nowrap transition-all duration-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {filteredMeals.length === 0 ? (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
          <p>No meals found</p>
          {searchTerm && <p className="text-sm mt-2">Try a different search term</p>}
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer touch-manipulation card-hover"
              onClick={() => onSelectMeal && onSelectMeal(meal)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{formatDate(meal.createdAt)}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
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
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs truncate max-w-[100px] sm:max-w-none"
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMeal(meal.id);
                  }}
                  className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 flex-shrink-0 touch-manipulation"
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

