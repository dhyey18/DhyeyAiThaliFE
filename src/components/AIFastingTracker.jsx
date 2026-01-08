import { useState } from 'react';
import axios from 'axios';
import { Timer, Clock, Utensils, Moon, Sun, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { API_BASE } from '../config';

const AIFastingTracker = () => {
  const [settings, setSettings] = useState({
    protocol: '16:8',
    goal: 'weight loss',
    wakeUpTime: '7:00 AM',
    sleepTime: '11:00 PM',
    lifestyle: 'moderate',
    dietaryPreference: 'Standard'
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const protocols = [
    { value: '16:8', label: '16:8', desc: '16h fast, 8h eat' },
    { value: '18:6', label: '18:6', desc: '18h fast, 6h eat' },
    { value: '20:4', label: '20:4', desc: '20h fast, 4h eat' },
    { value: 'OMAD', label: 'OMAD', desc: 'One Meal A Day' },
    { value: '5:2', label: '5:2', desc: '5 normal, 2 low-cal days' }
  ];

  const generatePlan = async () => {
    setLoading(true);
    setPlan(null);

    try {
      const response = await axios.post(`${API_BASE}/ai/fasting-plan`, settings);
      setPlan(response.data);
    } catch (error) {
      console.error('Error generating fasting plan:', error);
      alert('Failed to generate fasting plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <Timer className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">AI Fasting Planner</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Personalized intermittent fasting schedules</p>
          </div>
        </div>

        {/* Protocol Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">Choose Protocol</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {protocols.map((p) => (
              <button
                key={p.value}
                onClick={() => setSettings({ ...settings, protocol: p.value })}
                className={`p-3 rounded-xl text-center transition-all ${
                  settings.protocol === p.value
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                }`}
              >
                <p className="font-bold">{p.label}</p>
                <p className="text-xs opacity-75">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Goal</label>
            <select
              value={settings.goal}
              onChange={(e) => setSettings({ ...settings, goal: e.target.value })}
              className="select w-full"
            >
              <option value="weight loss">Weight Loss</option>
              <option value="metabolic health">Metabolic Health</option>
              <option value="mental clarity">Mental Clarity</option>
              <option value="longevity">Longevity</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Wake Up</label>
            <select
              value={settings.wakeUpTime}
              onChange={(e) => setSettings({ ...settings, wakeUpTime: e.target.value })}
              className="select w-full"
            >
              <option value="5:00 AM">5:00 AM</option>
              <option value="6:00 AM">6:00 AM</option>
              <option value="7:00 AM">7:00 AM</option>
              <option value="8:00 AM">8:00 AM</option>
              <option value="9:00 AM">9:00 AM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Sleep</label>
            <select
              value={settings.sleepTime}
              onChange={(e) => setSettings({ ...settings, sleepTime: e.target.value })}
              className="select w-full"
            >
              <option value="9:00 PM">9:00 PM</option>
              <option value="10:00 PM">10:00 PM</option>
              <option value="11:00 PM">11:00 PM</option>
              <option value="12:00 AM">12:00 AM</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Lifestyle</label>
            <select
              value={settings.lifestyle}
              onChange={(e) => setSettings({ ...settings, lifestyle: e.target.value })}
              className="select w-full"
            >
              <option value="sedentary">Sedentary (Desk Job)</option>
              <option value="moderate">Moderate Activity</option>
              <option value="active">Very Active</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Diet</label>
            <select
              value={settings.dietaryPreference}
              onChange={(e) => setSettings({ ...settings, dietaryPreference: e.target.value })}
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
          onClick={generatePlan}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Creating Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Fasting Plan
            </>
          )}
        </button>
      </div>

      {/* Plan Results */}
      {plan && (
        <div className="space-y-4 animate-fade-in">
          {/* Windows Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
              <div className="flex items-center gap-3 mb-3">
                <Moon className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Fasting Window</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{plan.fastingWindow?.duration}</p>
                </div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                {plan.fastingWindow?.start} → {plan.fastingWindow?.end}
              </p>
            </div>

            <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-center gap-3 mb-3">
                <Sun className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Eating Window</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">{plan.eatingWindow?.duration}</p>
                </div>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400">
                {plan.eatingWindow?.start} → {plan.eatingWindow?.end}
              </p>
            </div>
          </div>

          {/* Meal Schedule */}
          {plan.mealSchedule && (
            <div className="card p-6">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-green-500" />
                Meal Schedule
              </h3>
              <div className="space-y-4">
                {plan.mealSchedule.map((meal, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                    <div className="w-16 text-center">
                      <p className="font-bold text-primary-500">{meal.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">{meal.meal}</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        <strong>Focus:</strong> {meal.focus}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {meal.suggestions?.map((s, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-neutral-500">{meal.calories}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What to have during fast */}
          {plan.whatToHaveDuringFast && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">✅ Allowed During Fast</h4>
              <div className="flex flex-wrap gap-2">
                {plan.whatToHaveDuringFast.map((item, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {plan.benefitsExpected && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">🎯 Expected Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {plan.benefitsExpected.map((benefit, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips & Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.tips && plan.tips.length > 0 && (
              <div className="card p-4">
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">💡 Tips</h4>
                <ul className="space-y-1">
                  {plan.tips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {plan.warnings && plan.warnings.length > 0 && (
              <div className="card p-4 bg-yellow-50 dark:bg-yellow-900/20">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Important Warnings
                </h4>
                <ul className="space-y-1">
                  {plan.warnings.map((w, idx) => (
                    <li key={idx} className="text-sm text-yellow-700 dark:text-yellow-300">• {w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Progress Milestones */}
          {plan.progressMilestones && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">📈 What to Expect</h4>
              <div className="space-y-2">
                {plan.progressMilestones.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                    <span className="w-16 text-center font-bold text-primary-500">Week {m.week}</span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{m.expectation}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIFastingTracker;
