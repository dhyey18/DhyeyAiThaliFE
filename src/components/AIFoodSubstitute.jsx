import { useState } from 'react';
import axios from 'axios';
import { RefreshCw, Sparkles, ArrowRight, Check, Leaf } from 'lucide-react';
import { API_BASE } from '../config';

const AIFoodSubstitute = () => {
  const [food, setFood] = useState('');
  const [reason, setReason] = useState('general health');
  const [dietaryPreference, setDietaryPreference] = useState('Standard');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const popularFoods = ['Samosa', 'White Rice', 'Paratha', 'Gulab Jamun', 'Pakora', 'Naan'];

  const findSubstitutes = async () => {
    if (!food.trim()) {
      alert('Please enter a food item');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/ai/food-substitute`, {
        food: food.trim(),
        reason,
        dietaryPreference
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error finding substitutes:', error);
      alert('Failed to find substitutes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTasteColor = (taste) => {
    switch (taste) {
      case 'similar': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'milder': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Food Substitute Finder</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Find healthier alternatives for any food</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            What food do you want to substitute?
          </label>
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="e.g., Samosa, White Rice, Sugar..."
            className="input w-full"
          />
        </div>

        {/* Quick Select */}
        <div className="mb-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Popular foods:</p>
          <div className="flex flex-wrap gap-2">
            {popularFoods.map((item) => (
              <button
                key={item}
                onClick={() => setFood(item)}
                className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="select w-full"
            >
              <option value="general health">General Health</option>
              <option value="weight loss">Weight Loss</option>
              <option value="diabetes">Diabetes Management</option>
              <option value="heart health">Heart Health</option>
              <option value="digestion">Better Digestion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Diet</label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="select w-full"
            >
              <option value="Standard">Standard</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Jain">Jain</option>
            </select>
          </div>
        </div>

        <button
          onClick={findSubstitutes}
          disabled={loading || !food.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Finding Substitutes...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Find Healthier Options
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Original Food */}
          <div className="card p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">Original Food</p>
                <h3 className="text-xl font-bold text-red-800 dark:text-red-200">{result.originalFood?.name}</h3>
                <p className="text-sm text-red-600 dark:text-red-400">{result.originalFood?.calories} cal/serving</p>
              </div>
              <ArrowRight className="w-8 h-8 text-red-400" />
            </div>
            {result.originalFood?.concerns && (
              <div className="mt-2 flex flex-wrap gap-1">
                {result.originalFood.concerns.map((concern, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300 rounded-full">
                    {concern}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Substitutes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.substitutes?.map((sub, idx) => (
              <div key={idx} className="card p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100">{sub.name}</h4>
                    {sub.indianName && (
                      <p className="text-xs text-neutral-500 italic">({sub.indianName})</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTasteColor(sub.taste)}`}>
                    {sub.taste} taste
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{sub.calories}</p>
                    <p className="text-xs text-neutral-500">calories</p>
                  </div>
                  {sub.caloriesSaved > 0 && (
                    <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                        Save {sub.caloriesSaved} cal
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <p className="text-xs text-neutral-500 mb-1">Benefits:</p>
                  <div className="flex flex-wrap gap-1">
                    {sub.benefits?.map((benefit, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  <strong>How to use:</strong> {sub.howToUse}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    sub.availability === 'easy' ? 'bg-green-100 text-green-700' :
                    sub.availability === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {sub.availability} to find
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Best Choice */}
          {result.bestChoice && (
            <div className="card p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400 mb-1">🏆 Best Choice</p>
              <p className="font-semibold text-green-800 dark:text-green-200">{result.bestChoice}</p>
            </div>
          )}

          {/* Tip */}
          {result.tip && (
            <div className="card p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                💡 <strong>Tip:</strong> {result.tip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIFoodSubstitute;
