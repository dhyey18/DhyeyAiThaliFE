import { useState } from 'react';
import axios from 'axios';
import { Droplet, Plus, RefreshCw, Sparkles, Clock, Check, Coffee, Info } from 'lucide-react';
import { API_BASE } from '../config';

const AIHydrationTracker = () => {
  const [settings, setSettings] = useState({
    weight: '',
    activityLevel: 'moderate',
    climate: 'moderate',
    healthConditions: [],
    currentIntake: 0
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [todayGlasses, setTodayGlasses] = useState(0);

  const healthOptions = ['Diabetes', 'Kidney Issues', 'Heart Condition', 'Pregnancy'];

  const toggleCondition = (condition) => {
    setSettings(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }));
  };

  const calculateHydration = async () => {
    if (!settings.weight || settings.weight < 20) {
      alert('Please enter a valid weight');
      return;
    }

    setLoading(true);
    setPlan(null);

    try {
      const response = await axios.post(`${API_BASE}/ai/hydration`, {
        ...settings,
        weight: parseInt(settings.weight)
      });
      setPlan(response.data);
    } catch (error) {
      console.error('Error calculating hydration:', error);
      alert('Failed to calculate hydration needs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addGlass = () => {
    setTodayGlasses(prev => prev + 1);
  };

  const getProgress = () => {
    if (!plan?.recommendedIntake?.glasses) return 0;
    return Math.min(100, (todayGlasses / plan.recommendedIntake.glasses) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">AI Hydration Tracker</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Personalized daily water intake goals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Weight (kg) *</label>
            <input
              type="number"
              value={settings.weight}
              onChange={(e) => setSettings({ ...settings, weight: e.target.value })}
              placeholder="e.g., 70"
              className="input w-full"
              min="20"
              max="300"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Activity Level</label>
            <select
              value={settings.activityLevel}
              onChange={(e) => setSettings({ ...settings, activityLevel: e.target.value })}
              className="select w-full"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light Activity</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="athlete">Athlete</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Climate</label>
            <select
              value={settings.climate}
              onChange={(e) => setSettings({ ...settings, climate: e.target.value })}
              className="select w-full"
            >
              <option value="cold">Cold</option>
              <option value="moderate">Moderate</option>
              <option value="hot">Hot & Humid</option>
            </select>
          </div>
        </div>

        {/* Health Conditions */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Health Conditions (optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {healthOptions.map((condition) => (
              <button
                key={condition}
                onClick={() => toggleCondition(condition)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  settings.healthConditions.includes(condition)
                    ? 'bg-blue-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                }`}
              >
                {condition}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calculateHydration}
          disabled={loading || !settings.weight}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Calculate My Hydration Needs
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {plan && (
        <div className="space-y-4 animate-fade-in">
          {/* Main Goal */}
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <div className="text-center mb-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">Your Daily Target</p>
              <p className="text-5xl font-bold text-blue-700 dark:text-blue-300">
                {plan.recommendedIntake?.liters || 0}L
              </p>
              <p className="text-lg text-blue-600 dark:text-blue-400">
                ~{plan.recommendedIntake?.glasses || 0} glasses (250ml each)
              </p>
            </div>

            {/* Progress Tracker */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-600 dark:text-blue-400">Today's Progress</span>
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                  {todayGlasses}/{plan.recommendedIntake?.glasses || 8} glasses
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${getProgress()}%` }}
                >
                  {getProgress() >= 20 && (
                    <span className="text-xs text-white font-semibold">{Math.round(getProgress())}%</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={addGlass}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-neutral-700 text-blue-600 dark:text-blue-400 font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Log a Glass (250ml)
            </button>
          </div>

          {/* Breakdown */}
          {plan.breakdown && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">📊 How We Calculated</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Base Need (Weight)</span>
                  <span className="font-semibold">{plan.breakdown.baseNeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Activity Addition</span>
                  <span className="font-semibold">{plan.breakdown.activityAddition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Climate Adjustment</span>
                  <span className="font-semibold">{plan.breakdown.climateAdjustment}</span>
                </div>
              </div>
            </div>
          )}

          {/* Schedule */}
          {plan.schedule && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Daily Schedule
              </h4>
              <div className="space-y-2">
                {plan.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                    <span className="w-16 text-center font-semibold text-blue-600 dark:text-blue-400">{item.time}</span>
                    <span className="text-neutral-600 dark:text-neutral-400">{item.amount}</span>
                    <span className="text-xs text-neutral-500 ml-auto">{item.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Indian Beverages */}
          {plan.indianBeverages && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                <Coffee className="w-4 h-4 text-amber-500" />
                Indian Beverages That Count
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {plan.indianBeverages.map((bev, idx) => (
                  <div key={idx} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="font-semibold text-amber-800 dark:text-amber-200">{bev.name}</p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">{bev.countAs}</p>
                    <p className="text-xs text-neutral-500 mt-1">Best: {bev.when}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Signs */}
          {plan.signs && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4 bg-yellow-50 dark:bg-yellow-900/20">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Dehydration Signs</h4>
                <ul className="space-y-1">
                  {plan.signs.dehydration?.map((sign, idx) => (
                    <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                      <span>•</span> {sign}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-4 bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💧 Overhydration Signs</h4>
                <ul className="space-y-1">
                  {plan.signs.overhydration?.map((sign, idx) => (
                    <li key={idx} className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                      <span>•</span> {sign}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tips */}
          {plan.tips && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">💡 Hydration Tips</h4>
              <ul className="space-y-1">
                {plan.tips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIHydrationTracker;
