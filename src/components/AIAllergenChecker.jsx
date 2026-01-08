import { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, Shield, Check, RefreshCw, Sparkles, AlertCircle, Info, HelpCircle } from 'lucide-react';
import { API_BASE } from '../config';

const AIAllergenChecker = () => {
  const [mealDescription, setMealDescription] = useState('');
  const [knownAllergies, setKnownAllergies] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const commonAllergens = ['Dairy', 'Gluten', 'Nuts', 'Peanuts', 'Shellfish', 'Eggs', 'Soy', 'Sesame'];

  const examples = [
    "Paneer butter masala with naan",
    "Prawn biryani with raita",
    "Chocolate brownie with ice cream",
    "Mixed vegetable pakoras"
  ];

  const toggleAllergy = (allergy) => {
    setKnownAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const checkAllergens = async () => {
    if (!mealDescription.trim()) {
      alert('Please describe your meal');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE}/ai/allergen-check`, {
        mealDescription: mealDescription.trim(),
        knownAllergies
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error checking allergens:', error);
      alert('Failed to check allergens. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSafetyColor = (level) => {
    switch (level) {
      case 'safe': return 'from-green-500 to-emerald-500';
      case 'caution': return 'from-yellow-500 to-amber-500';
      case 'warning': return 'from-orange-500 to-red-500';
      case 'danger': return 'from-red-500 to-red-700';
      default: return 'from-neutral-400 to-neutral-500';
    }
  };

  const getSafetyIcon = (level) => {
    switch (level) {
      case 'safe': return <Check className="w-8 h-8" />;
      case 'caution': return <Info className="w-8 h-8" />;
      case 'warning': return <AlertCircle className="w-8 h-8" />;
      case 'danger': return <AlertTriangle className="w-8 h-8" />;
      default: return <HelpCircle className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">AI Allergen Checker</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Detect potential allergens in any food</p>
          </div>
        </div>

        {/* Known Allergies */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Your Known Allergies (select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {commonAllergens.map((allergy) => (
              <button
                key={allergy}
                onClick={() => toggleAllergy(allergy)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  knownAllergies.includes(allergy)
                    ? 'bg-red-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                }`}
              >
                {allergy}
              </button>
            ))}
          </div>
        </div>

        {/* Meal Description */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Describe the Food/Meal
          </label>
          <textarea
            value={mealDescription}
            onChange={(e) => setMealDescription(e.target.value)}
            placeholder="e.g., Paneer butter masala with butter naan and raita"
            rows={3}
            className="input w-full resize-none"
          />
        </div>

        {/* Examples */}
        <div className="mb-6">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Try these:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => setMealDescription(ex)}
                className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={checkAllergens}
          disabled={loading || !mealDescription.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Check for Allergens
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Safety Level */}
          <div className={`card p-6 bg-gradient-to-r ${getSafetyColor(result.overallSafetyLevel)} text-white`}>
            <div className="flex items-center gap-4">
              {getSafetyIcon(result.overallSafetyLevel)}
              <div>
                <p className="text-sm opacity-90">Safety Level</p>
                <p className="text-3xl font-bold capitalize">{result.overallSafetyLevel}</p>
              </div>
            </div>
            {result.crossContaminationRisk && (
              <p className="mt-3 text-sm opacity-90">
                Cross-contamination risk: <strong>{result.crossContaminationRisk}</strong>
              </p>
            )}
          </div>

          {/* Detected Allergens */}
          {result.detectedAllergens && result.detectedAllergens.length > 0 && (
            <div className="card p-4">
              <h4 className="font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Detected Allergens ({result.detectedAllergens.length})
              </h4>
              <div className="space-y-3">
                {result.detectedAllergens.map((allergen, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-xl ${
                      allergen.isKnownAllergy 
                        ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700' 
                        : 'bg-yellow-50 dark:bg-yellow-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                          {allergen.allergen}
                          {allergen.isKnownAllergy && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                              YOUR ALLERGY
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                          Found in: {allergen.foundIn?.join(', ')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        allergen.severity === 'severe' ? 'bg-red-100 text-red-700' :
                        allergen.severity === 'moderate' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {allergen.severity}
                      </span>
                    </div>
                    {allergen.details && (
                      <p className="text-xs text-neutral-500 mt-2">{allergen.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hidden Allergens */}
          {result.hiddenAllergens && result.hiddenAllergens.length > 0 && (
            <div className="card p-4 bg-amber-50 dark:bg-amber-900/20">
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Hidden Allergens to Watch
              </h4>
              <div className="space-y-2">
                {result.hiddenAllergens.map((hidden, idx) => (
                  <div key={idx} className="p-2 bg-white/50 dark:bg-neutral-800/50 rounded-lg">
                    <p className="font-medium text-amber-700 dark:text-amber-300">{hidden.allergen}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">{hidden.commonlyFoundIn}</p>
                    <p className="text-xs text-neutral-500 mt-1">💡 {hidden.tipToAvoid}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safe Alternatives */}
          {result.safeAlternatives && result.safeAlternatives.length > 0 && (
            <div className="card p-4">
              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5" />
                Safe Alternatives
              </h4>
              <div className="space-y-2">
                {result.safeAlternatives.map((alt, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-neutral-600 dark:text-neutral-400 line-through">{alt.for}</span>
                    <span className="text-green-600">→</span>
                    <span className="font-semibold text-green-700 dark:text-green-300">{alt.substitute}</span>
                    {alt.indianOption && (
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 rounded-full">
                        🇮🇳 {alt.indianOption}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions to Ask */}
          {result.questionsToAsk && result.questionsToAsk.length > 0 && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">❓ Ask at Restaurant</h4>
              <ul className="space-y-1">
                {result.questionsToAsk.map((q, idx) => (
                  <li key={idx} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    "{q}"
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Emergency Advice */}
          {result.emergencyAdvice && (
            <div className="card p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
              <h4 className="font-bold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Emergency Advice
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400">{result.emergencyAdvice}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIAllergenChecker;
