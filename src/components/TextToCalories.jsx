import { useState } from 'react';
import axios from 'axios';
import { FileText, Search, AlertCircle, CheckCircle, Sparkles, Plus } from 'lucide-react';
import { API_BASE } from '../config';

const TextToCalories = ({ onSave }) => {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const examples = [
    "2 roti with dal and sabzi",
    "One plate biryani with raita",
    "Idli sambar with coconut chutney",
    "Cheese paratha with curd"
  ];

  const analyzeText = async () => {
    if (!description.trim()) {
      alert('Please describe your meal');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/ai/text-to-calories`, {
        mealDescription: description
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing text:', error);
      alert('Failed to analyze meal description');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async () => {
    if (!result) return;

    try {
      await axios.post(`${API_BASE}/meals/quick-add`, {
        items: result.items.map(item => ({
          name: item.name,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fats: item.fats
        })),
        totalCalories: result.totals.calories,
        macros: result.totals,
        mealType: 'Meal',
        advice: `Estimated from: "${description}"`
      });
      if (onSave) onSave();
      alert('Meal logged successfully!');
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Failed to save meal');
    }
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'high': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default: return 'text-neutral-500 bg-neutral-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Text to Calories</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Describe your meal, get instant calorie estimates</p>
          </div>
        </div>

        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your meal... e.g., 'I had 2 chapatis with dal fry and mixed vegetable sabzi'"
            rows={4}
            className="w-full input resize-none"
          />
        </div>

        {/* Examples */}
        <div className="mb-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => setDescription(ex)}
                className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
              >
                "{ex}"
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={analyzeText}
          disabled={loading || !description.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <Search className="w-5 h-5 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze Meal
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Analysis Results</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(result.confidence)}`}>
              {result.confidence === 'high' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <AlertCircle className="w-3 h-3 inline mr-1" />}
              {result.confidence} confidence
            </span>
          </div>

          {result.interpretation && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 italic">
              "{result.interpretation}"
            </p>
          )}

          {/* Items Breakdown */}
          <div className="space-y-3 mb-6">
            {result.items?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.name}</p>
                  <p className="text-xs text-neutral-500">{item.estimatedPortion}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500">{item.calories} kcal</p>
                  <p className="text-xs text-neutral-500">P: {item.protein}g | C: {item.carbs}g | F: {item.fats}g</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="p-4 bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/20 dark:to-orange-900/20 rounded-xl mb-4">
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Total Nutrition</h4>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-orange-500">{result.totals?.calories}</p>
                <p className="text-xs text-neutral-500">Calories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{result.totals?.protein}g</p>
                <p className="text-xs text-neutral-500">Protein</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{result.totals?.carbs}g</p>
                <p className="text-xs text-neutral-500">Carbs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-500">{result.totals?.fats}g</p>
                <p className="text-xs text-neutral-500">Fats</p>
              </div>
            </div>
          </div>

          {result.notes && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              ⚠️ {result.notes}
            </p>
          )}

          <button
            onClick={handleQuickAdd}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Log This Meal
          </button>
        </div>
      )}
    </div>
  );
};

export default TextToCalories;
