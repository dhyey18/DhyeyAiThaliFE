import { useState } from 'react';
import axios from 'axios';
import { Dumbbell, Target, Activity, Flame, Trophy, Clock, Sparkles } from 'lucide-react';
import { API_BASE } from '../config';

const AIDietCoach = () => {
  const [profile, setProfile] = useState({
    goal: 'maintenance',
    currentWeight: '',
    targetWeight: '',
    activityLevel: 'moderate',
    dietaryPreference: 'Standard',
    challenges: []
  });
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(false);

  const challengeOptions = [
    'Late night cravings',
    'Skipping breakfast',
    'Too much sugar',
    'Eating out often',
    'Not enough protein',
    'Portion control',
    'Emotional eating',
    'No time to cook'
  ];

  const toggleChallenge = (challenge) => {
    setProfile(prev => ({
      ...prev,
      challenges: prev.challenges.includes(challenge)
        ? prev.challenges.filter(c => c !== challenge)
        : [...prev.challenges, challenge]
    }));
  };

  const getCoaching = async () => {
    setLoading(true);
    setCoaching(null);

    try {
      const response = await axios.post(`${API_BASE}/ai/diet-coach`, profile);
      setCoaching(response.data);
    } catch (error) {
      console.error('Error getting coaching:', error);
      alert('Failed to get coaching advice');
    } finally {
      setLoading(false);
    }
  };

  const getGoalIcon = (goal) => {
    switch (goal) {
      case 'weightLoss': return <Flame className="w-5 h-5 text-red-500" />;
      case 'muscleGain': return <Dumbbell className="w-5 h-5 text-blue-500" />;
      case 'maintenance': return <Activity className="w-5 h-5 text-green-500" />;
      default: return <Target className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Input */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">AI Diet Coach</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Get personalized diet advice and coaching</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Your Goal</label>
            <select
              value={profile.goal}
              onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
              className="select w-full"
            >
              <option value="weightLoss">🔥 Weight Loss</option>
              <option value="muscleGain">💪 Muscle Gain</option>
              <option value="maintenance">⚖️ Maintenance</option>
              <option value="healthyEating">🥗 Healthy Eating</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Current Weight (kg)</label>
            <input
              type="number"
              value={profile.currentWeight}
              onChange={(e) => setProfile({ ...profile, currentWeight: e.target.value })}
              placeholder="e.g., 75"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Target Weight (kg)</label>
            <input
              type="number"
              value={profile.targetWeight}
              onChange={(e) => setProfile({ ...profile, targetWeight: e.target.value })}
              placeholder="e.g., 70"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Activity Level</label>
            <select
              value={profile.activityLevel}
              onChange={(e) => setProfile({ ...profile, activityLevel: e.target.value })}
              className="select w-full"
            >
              <option value="sedentary">Sedentary (Desk job)</option>
              <option value="light">Light (1-2 days exercise)</option>
              <option value="moderate">Moderate (3-4 days exercise)</option>
              <option value="active">Active (5-6 days exercise)</option>
              <option value="veryActive">Very Active (Athlete)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Diet Preference</label>
            <select
              value={profile.dietaryPreference}
              onChange={(e) => setProfile({ ...profile, dietaryPreference: e.target.value })}
              className="select w-full"
            >
              <option value="Standard">Standard</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Jain">Jain</option>
              <option value="Keto">Keto</option>
            </select>
          </div>
        </div>

        {/* Challenges */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Your Challenges (select all that apply)
          </label>
          <div className="flex flex-wrap gap-2">
            {challengeOptions.map((challenge) => (
              <button
                key={challenge}
                onClick={() => toggleChallenge(challenge)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  profile.challenges.includes(challenge)
                    ? 'bg-indigo-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                }`}
              >
                {challenge}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={getCoaching}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <Dumbbell className="w-5 h-5 animate-pulse" />
              Getting Your Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Get Personalized Coaching
            </>
          )}
        </button>
      </div>

      {/* Coaching Results */}
      {coaching && (
        <div className="space-y-4 animate-fade-in">
          {/* Greeting */}
          <div className="card p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <p className="text-xl font-semibold text-indigo-800 dark:text-indigo-200">
              {coaching.greeting}
            </p>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {coaching.assessment}
            </p>
          </div>

          {/* Targets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4 text-center">
              <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{coaching.dailyCalorieTarget}</p>
              <p className="text-xs text-neutral-500">Daily Calories</p>
            </div>
            {coaching.macroTargets && (
              <>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-blue-500">{coaching.macroTargets.protein}</p>
                  <p className="text-xs text-neutral-500">Protein/day</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-green-500">{coaching.macroTargets.carbs}</p>
                  <p className="text-xs text-neutral-500">Carbs/day</p>
                </div>
                <div className="card p-4 text-center">
                  <p className="text-2xl font-bold text-purple-500">{coaching.macroTargets.fats}</p>
                  <p className="text-xs text-neutral-500">Fats/day</p>
                </div>
              </>
            )}
          </div>

          {/* Action Plan */}
          {coaching.actionPlan && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                Your Action Plan
              </h3>
              <div className="space-y-3">
                {coaching.actionPlan.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                    <span className="w-6 h-6 flex-shrink-0 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.priority}
                    </span>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">{item.action}</p>
                      <p className="text-sm text-neutral-500">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meal Timing */}
          {coaching.mealTiming && (
            <div className="card p-6">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                Meal Timing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(coaching.mealTiming).map(([meal, timing]) => (
                  <div key={meal} className="p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                    <p className="font-semibold capitalize text-neutral-900 dark:text-neutral-100">{meal}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{timing}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Foods to Prioritize */}
          {coaching.indianFoodsToPrioritize && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4">
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">✅ Foods to Prioritize</h4>
                <div className="flex flex-wrap gap-2">
                  {coaching.indianFoodsToPrioritize.map((food, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                      {food}
                    </span>
                  ))}
                </div>
              </div>
              {coaching.foodsToLimit && (
                <div className="card p-4">
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">⚠️ Foods to Limit</h4>
                  <div className="flex flex-wrap gap-2">
                    {coaching.foodsToLimit.map((food, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm">
                        {food}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Motivation */}
          {coaching.motivationalTip && (
            <div className="card p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span className="font-medium">{coaching.motivationalTip}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIDietCoach;
