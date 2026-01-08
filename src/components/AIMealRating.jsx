import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, TrendingUp, Award, ThumbsUp, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import { API_BASE } from '../config';

const AIMealRating = () => {
  const [recentMeals, setRecentMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [goal, setGoal] = useState('balanced');
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMeals, setLoadingMeals] = useState(true);

  useEffect(() => {
    loadRecentMeals();
  }, []);

  const loadRecentMeals = async () => {
    try {
      const response = await axios.get(`${API_BASE}/meals`, { params: { limit: 10 } });
      setRecentMeals(response.data.meals || []);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoadingMeals(false);
    }
  };

  const rateMeal = async () => {
    if (!selectedMeal) {
      alert('Please select a meal to rate');
      return;
    }

    setLoading(true);
    setRating(null);

    try {
      const response = await axios.post(`${API_BASE}/ai/meal-rating`, {
        items: selectedMeal.items || [],
        totalCalories: selectedMeal.totalCalories || selectedMeal.total_calories || 0,
        mealType: selectedMeal.mealType || 'Lunch',
        dietaryPreference: selectedMeal.dietaryPreference || 'Standard',
        goal
      });
      setRating(response.data);
    } catch (error) {
      console.error('Error rating meal:', error);
      alert('Failed to rate meal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'from-neutral-400 to-neutral-500';
    if (grade.startsWith('A')) return 'from-green-400 to-green-600';
    if (grade.startsWith('B')) return 'from-blue-400 to-blue-600';
    if (grade.startsWith('C')) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score / 2);
    const halfStar = score % 2 >= 1;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && halfStar) {
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-neutral-300 dark:text-neutral-600" />);
      }
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">AI Meal Rating</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Get your meals rated with improvement tips</p>
          </div>
        </div>

        {/* Goal Selection */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Your Goal</label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="select w-full"
          >
            <option value="balanced">🥗 Balanced Nutrition</option>
            <option value="weightLoss">🔥 Weight Loss</option>
            <option value="muscleGain">💪 Muscle Gain</option>
            <option value="energy">⚡ Energy Boost</option>
          </select>
        </div>

        {/* Meal Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Select a Recent Meal to Rate
          </label>
          
          {loadingMeals ? (
            <div className="text-center py-4 text-neutral-500">Loading meals...</div>
          ) : recentMeals.length === 0 ? (
            <div className="text-center py-4 text-neutral-500">
              No meals found. Log some meals first!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {recentMeals.map((meal) => (
                <div
                  key={meal.id || meal._id}
                  onClick={() => setSelectedMeal(meal)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedMeal?.id === meal.id || selectedMeal?._id === meal._id
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-transparent bg-neutral-50 dark:bg-neutral-700/50 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                      {meal.mealType || 'Meal'}
                    </p>
                    <span className="text-xs text-neutral-500">
                      {new Date(meal.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
                    {meal.items?.map(i => i.name).join(', ') || 'No items'}
                  </p>
                  <p className="text-sm font-bold text-orange-500 mt-1">
                    {meal.totalCalories || meal.total_calories || 0} kcal
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={rateMeal}
          disabled={loading || !selectedMeal}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Rating Meal...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Rate This Meal
            </>
          )}
        </button>
      </div>

      {/* Rating Results */}
      {rating && (
        <div className="space-y-4 animate-fade-in">
          {/* Score Card */}
          <div className="card p-6 text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${getGradeColor(rating.grade)} mb-4`}>
              <span className="text-4xl font-bold text-white">{rating.grade}</span>
            </div>
            
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(rating.rating)}
            </div>
            
            <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              {rating.rating}/10
            </p>
            
            <p className="text-neutral-600 dark:text-neutral-400">{rating.summary}</p>
            
            {rating.calorieVerdict && (
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${
                rating.calorieVerdict === 'appropriate' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : rating.calorieVerdict === 'too low'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                Calories: {rating.calorieVerdict}
              </span>
            )}
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rating.strengths && rating.strengths.length > 0 && (
              <div className="card p-4">
                <h4 className="font-bold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {rating.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="text-green-500 mt-1">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {rating.improvements && rating.improvements.length > 0 && (
              <div className="card p-4">
                <h4 className="font-bold text-orange-600 dark:text-orange-400 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Improvements
                </h4>
                <ul className="space-y-3">
                  {rating.improvements.map((imp, idx) => (
                    <li key={idx} className="text-sm">
                      <p className="text-neutral-800 dark:text-neutral-200 font-medium">{imp.issue}</p>
                      <p className="text-neutral-500">{imp.suggestion}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Missing Nutrients */}
          {rating.missingNutrients && rating.missingNutrients.length > 0 && (
            <div className="card p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Missing Nutrients
              </h4>
              <div className="flex flex-wrap gap-2">
                {rating.missingNutrients.map((n, idx) => (
                  <span key={idx} className="px-3 py-1 bg-yellow-100 dark:bg-yellow-800/50 text-yellow-700 dark:text-yellow-300 rounded-full text-sm">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Indian Twist */}
          {rating.indianTwist && (
            <div className="card p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                🍛 <strong>Indian Twist:</strong> {rating.indianTwist}
              </p>
            </div>
          )}

          {/* Motivational Note */}
          {rating.motivationalNote && (
            <div className="card p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="font-medium">{rating.motivationalNote}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIMealRating;
