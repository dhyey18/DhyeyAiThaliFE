import { useState } from 'react';
import axios from 'axios';
import { Scale, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { API_BASE } from '../config';

const FoodComparison = () => {
  const [food1, setFood1] = useState('');
  const [food2, setFood2] = useState('');
  const [portion1, setPortion1] = useState('100g');
  const [portion2, setPortion2] = useState('100g');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const popularComparisons = [
    ['Roti', 'Rice'],
    ['Paneer', 'Tofu'],
    ['Dahi', 'Buttermilk'],
    ['Ghee', 'Olive Oil']
  ];

  const compareFoods = async () => {
    if (!food1.trim() || !food2.trim()) {
      alert('Please enter both foods to compare');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/ai/compare-foods`, {
        food1,
        food2,
        portion1,
        portion2
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error comparing foods:', error);
      alert('Failed to compare foods');
    } finally {
      setLoading(false);
    }
  };

  const getNutrientBar = (val1, val2, color) => {
    const max = Math.max(val1, val2, 1);
    return (
      <div className="flex gap-2 items-center">
        <div className="flex-1 flex justify-end">
          <div
            className={`h-3 rounded-l-full bg-gradient-to-l ${color}`}
            style={{ width: `${(val1 / max) * 100}%` }}
          ></div>
        </div>
        <div className="w-12 text-center text-xs text-neutral-500">vs</div>
        <div className="flex-1">
          <div
            className={`h-3 rounded-r-full bg-gradient-to-r ${color}`}
            style={{ width: `${(val2 / max) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Food Comparison</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Compare any two foods side by side</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Food 1</label>
            <input
              type="text"
              value={food1}
              onChange={(e) => setFood1(e.target.value)}
              placeholder="e.g., Roti"
              className="input w-full"
            />
            <select
              value={portion1}
              onChange={(e) => setPortion1(e.target.value)}
              className="select w-full mt-2 text-sm"
            >
              <option value="100g">100g</option>
              <option value="1 serving">1 serving</option>
              <option value="1 piece">1 piece</option>
              <option value="1 bowl">1 bowl</option>
            </select>
          </div>

          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-neutral-400" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Food 2</label>
            <input
              type="text"
              value={food2}
              onChange={(e) => setFood2(e.target.value)}
              placeholder="e.g., Rice"
              className="input w-full"
            />
            <select
              value={portion2}
              onChange={(e) => setPortion2(e.target.value)}
              className="select w-full mt-2 text-sm"
            >
              <option value="100g">100g</option>
              <option value="1 serving">1 serving</option>
              <option value="1 piece">1 piece</option>
              <option value="1 bowl">1 bowl</option>
            </select>
          </div>
        </div>

        {/* Popular Comparisons */}
        <div className="mb-6">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Popular comparisons:</p>
          <div className="flex flex-wrap gap-2">
            {popularComparisons.map(([f1, f2], idx) => (
              <button
                key={idx}
                onClick={() => { setFood1(f1); setFood2(f2); }}
                className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                {f1} vs {f2}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={compareFoods}
          disabled={loading || !food1.trim() || !food2.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <Scale className="w-5 h-5 animate-pulse" />
              Comparing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Compare Foods
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Comparison Header */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4 text-center">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{result.food1?.name}</h3>
              <p className="text-sm text-neutral-500">{result.food1?.portion}</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">{result.food1?.calories} kcal</p>
            </div>
            <div className="card p-4 text-center">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{result.food2?.name}</h3>
              <p className="text-sm text-neutral-500">{result.food2?.portion}</p>
              <p className="text-3xl font-bold text-orange-500 mt-2">{result.food2?.calories} kcal</p>
            </div>
          </div>

          {/* Nutrient Comparison */}
          <div className="card p-6">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4 text-center">Nutritional Comparison</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600 dark:text-neutral-400">{result.food1?.protein}g</span>
                  <span className="font-semibold">Protein</span>
                  <span className="text-neutral-600 dark:text-neutral-400">{result.food2?.protein}g</span>
                </div>
                {getNutrientBar(result.food1?.protein || 0, result.food2?.protein || 0, 'from-blue-400 to-blue-500')}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600 dark:text-neutral-400">{result.food1?.carbs}g</span>
                  <span className="font-semibold">Carbs</span>
                  <span className="text-neutral-600 dark:text-neutral-400">{result.food2?.carbs}g</span>
                </div>
                {getNutrientBar(result.food1?.carbs || 0, result.food2?.carbs || 0, 'from-green-400 to-green-500')}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600 dark:text-neutral-400">{result.food1?.fats}g</span>
                  <span className="font-semibold">Fats</span>
                  <span className="text-neutral-600 dark:text-neutral-400">{result.food2?.fats}g</span>
                </div>
                {getNutrientBar(result.food1?.fats || 0, result.food2?.fats || 0, 'from-purple-400 to-purple-500')}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-600 dark:text-neutral-400">{result.food1?.fiber}g</span>
                  <span className="font-semibold">Fiber</span>
                  <span className="text-neutral-600 dark:text-neutral-400">{result.food2?.fiber}g</span>
                </div>
                {getNutrientBar(result.food1?.fiber || 0, result.food2?.fiber || 0, 'from-yellow-400 to-orange-500')}
              </div>
            </div>
          </div>

          {/* Winner Card */}
          {result.comparison && (
            <div className="card p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Healthier Choice</p>
                  <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {result.comparison.healthierChoice === 'food1' ? result.food1?.name : result.food2?.name}
                  </h3>
                </div>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300">{result.comparison.explanation}</p>
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div className="card p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                <strong className="text-neutral-900 dark:text-neutral-100">💡 Recommendation:</strong> {result.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodComparison;
