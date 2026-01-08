import { useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Download, Check, Sparkles, IndianRupee } from 'lucide-react';
import { API_BASE } from '../config';

const SmartGroceryList = () => {
  const [settings, setSettings] = useState({
    days: 7,
    mealsPerDay: 3,
    familySize: 2,
    dietaryPreference: 'Standard',
    budget: 'medium'
  });
  const [groceryData, setGroceryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  const generateList = async () => {
    setLoading(true);
    setGroceryData(null);
    setCheckedItems({});

    try {
      const response = await axios.post(`${API_BASE}/ai/grocery-list`, settings);
      setGroceryData(response.data);
    } catch (error) {
      console.error('Error generating grocery list:', error);
      alert('Failed to generate grocery list');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (category, itemName) => {
    const key = `${category}-${itemName}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const exportList = () => {
    if (!groceryData?.groceryList) return;
    
    let text = '🛒 GROCERY LIST\n';
    text += `📅 For ${settings.days} days, ${settings.familySize} person(s)\n\n`;
    
    Object.entries(groceryData.groceryList).forEach(([category, items]) => {
      if (items && items.length > 0) {
        text += `\n${category.toUpperCase()}\n`;
        text += '-'.repeat(20) + '\n';
        items.forEach(item => {
          text += `☐ ${item.item} - ${item.quantity} (₹${item.estimatedCost})\n`;
        });
      }
    });
    
    text += `\n\nEstimated Total: ₹${groceryData.estimatedTotalCost}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'grocery-list.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'vegetables': return '🥬';
      case 'fruits': return '🍎';
      case 'dairy': return '🥛';
      case 'grains': return '🌾';
      case 'pulses': return '🫘';
      case 'spices': return '🌶️';
      case 'oils': return '🫒';
      default: return '📦';
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Smart Grocery List</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">AI-generated shopping list for healthy Indian meals</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Days</label>
            <select
              value={settings.days}
              onChange={(e) => setSettings({ ...settings, days: parseInt(e.target.value) })}
              className="select w-full text-sm"
            >
              <option value={3}>3 Days</option>
              <option value={5}>5 Days</option>
              <option value={7}>1 Week</option>
              <option value={14}>2 Weeks</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Meals/Day</label>
            <select
              value={settings.mealsPerDay}
              onChange={(e) => setSettings({ ...settings, mealsPerDay: parseInt(e.target.value) })}
              className="select w-full text-sm"
            >
              <option value={2}>2 Meals</option>
              <option value={3}>3 Meals</option>
              <option value={4}>4 Meals</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Family Size</label>
            <select
              value={settings.familySize}
              onChange={(e) => setSettings({ ...settings, familySize: parseInt(e.target.value) })}
              className="select w-full text-sm"
            >
              <option value={1}>1 Person</option>
              <option value={2}>2 People</option>
              <option value={3}>3 People</option>
              <option value={4}>4 People</option>
              <option value={5}>5+ People</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Diet</label>
            <select
              value={settings.dietaryPreference}
              onChange={(e) => setSettings({ ...settings, dietaryPreference: e.target.value })}
              className="select w-full text-sm"
            >
              <option value="Standard">Standard</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Jain">Jain</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Budget</label>
            <select
              value={settings.budget}
              onChange={(e) => setSettings({ ...settings, budget: e.target.value })}
              className="select w-full text-sm"
            >
              <option value="low">Budget</option>
              <option value="medium">Moderate</option>
              <option value="high">Premium</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateList}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <ShoppingCart className="w-5 h-5 animate-pulse" />
              Generating List...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Grocery List
            </>
          )}
        </button>
      </div>

      {/* Grocery List */}
      {groceryData && groceryData.groceryList && (
        <div className="space-y-4 animate-fade-in">
          {/* Summary */}
          <div className="card p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IndianRupee className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Estimated Total</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    ₹{groceryData.estimatedTotalCost}
                  </p>
                </div>
              </div>
              <button
                onClick={exportList}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 rounded-xl hover:shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(groceryData.groceryList).map(([category, items]) => (
              items && items.length > 0 && (
                <div key={category} className="card p-4">
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2 capitalize">
                    <span>{getCategoryEmoji(category)}</span>
                    {category}
                    <span className="text-sm font-normal text-neutral-500">({items.length})</span>
                  </h3>
                  <div className="space-y-2">
                    {items.map((item, idx) => {
                      const key = `${category}-${item.item}`;
                      const isChecked = checkedItems[key];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleItem(category, item.item)}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-green-100 dark:bg-green-900/30 line-through opacity-60'
                              : 'bg-neutral-50 dark:bg-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isChecked
                                ? 'bg-green-500 border-green-500'
                                : 'border-neutral-300 dark:border-neutral-600'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm text-neutral-800 dark:text-neutral-200">{item.item}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-neutral-500">{item.quantity}</p>
                            <p className="text-xs font-semibold text-emerald-600">₹{item.estimatedCost}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* Meal Suggestions */}
          {groceryData.mealSuggestions && (
            <div className="card p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">🍽️ Meal Ideas</h3>
              <div className="flex flex-wrap gap-2">
                {groceryData.mealSuggestions.map((meal, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                    {meal}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {groceryData.shoppingTips && (
            <div className="card p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">💡 Shopping Tips</h3>
              <ul className="space-y-1">
                {groceryData.shoppingTips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-neutral-600 dark:text-neutral-400">• {tip}</li>
                ))}
              </ul>
            </div>
          )}

          {groceryData.storageAdvice && (
            <div className="card p-4 bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                📦 <strong>Storage:</strong> {groceryData.storageAdvice}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartGroceryList;
