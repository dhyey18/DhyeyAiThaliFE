import { useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Download, Check, Sparkles, IndianRupee, MapPin, Clock, Package, Leaf, TrendingUp, AlertCircle, RefreshCw, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { API_BASE } from '../config';

const SmartGroceryList = () => {
  const [settings, setSettings] = useState({
    days: 7,
    mealsPerDay: 3,
    familySize: 2,
    dietaryPreference: 'Standard',
    budget: 'medium',
    shoppingLocation: 'local',
    prioritizeOrganic: false,
    includeSnacks: true
  });
  const [pantryItems, setPantryItems] = useState([]);
  const [newPantryItem, setNewPantryItem] = useState('');
  const [groceryData, setGroceryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [activeView, setActiveView] = useState('list'); // list, route, nutrition

  const addPantryItem = () => {
    if (newPantryItem.trim() && !pantryItems.includes(newPantryItem.trim())) {
      setPantryItems([...pantryItems, newPantryItem.trim()]);
      setNewPantryItem('');
    }
  };

  const removePantryItem = (item) => {
    setPantryItems(pantryItems.filter(p => p !== item));
  };

  const generateList = async () => {
    setLoading(true);
    setGroceryData(null);
    setCheckedItems({});

    try {
      const response = await axios.post(`${API_BASE}/ai/grocery-list`, {
        ...settings,
        pantryItems
      });
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

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getProgress = () => {
    if (!groceryData?.groceryList) return { checked: 0, total: 0 };
    let total = 0;
    Object.values(groceryData.groceryList).forEach(items => {
      if (items) total += items.length;
    });
    const checked = Object.values(checkedItems).filter(Boolean).length;
    return { checked, total, percent: total ? Math.round((checked / total) * 100) : 0 };
  };

  const exportList = () => {
    if (!groceryData?.groceryList) return;
    
    let text = '🛒 SMART GROCERY LIST\n';
    text += `📅 For ${settings.days} days, ${settings.familySize} person(s)\n`;
    text += `💰 Budget: ${settings.budget}\n\n`;
    
    Object.entries(groceryData.groceryList).forEach(([category, items]) => {
      if (items && items.length > 0) {
        text += `\n${getCategoryEmoji(category)} ${category.toUpperCase()}\n`;
        text += '-'.repeat(25) + '\n';
        items.forEach(item => {
          const isChecked = checkedItems[`${category}-${item.item}`];
          text += `${isChecked ? '☑' : '☐'} ${item.item} - ${item.quantity}`;
          if (item.estimatedCost) text += ` (₹${item.estimatedCost})`;
          text += '\n';
        });
      }
    });
    
    if (groceryData.estimatedTotalCost?.total) {
      text += `\n\nEstimated Total: ₹${groceryData.estimatedTotalCost.total}`;
    }
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grocery-list-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      vegetables: '🥬', fruits: '🍎', dairy: '🥛', grains: '🌾',
      pulses: '🫘', spices: '🌶️', oils: '🫒', snacks: '🍪',
      beverages: '🥤', others: '📦'
    };
    return emojis[category] || '📦';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const progress = getProgress();

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Smart Grocery List</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">AI-powered shopping with route optimization</p>
          </div>
        </div>

        {/* Basic Settings */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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
              <option value="low">💰 Budget</option>
              <option value="medium">💰💰 Moderate</option>
              <option value="high">💰💰💰 Premium</option>
            </select>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Shop At</label>
            <select
              value={settings.shoppingLocation}
              onChange={(e) => setSettings({ ...settings, shoppingLocation: e.target.value })}
              className="select w-full text-sm"
            >
              <option value="local">🏪 Local Market</option>
              <option value="supermarket">🛒 Supermarket</option>
              <option value="online">📦 Online</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 p-2.5 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl cursor-pointer w-full">
              <input
                type="checkbox"
                checked={settings.prioritizeOrganic}
                onChange={(e) => setSettings({ ...settings, prioritizeOrganic: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">🌱 Organic</span>
            </label>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 p-2.5 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl cursor-pointer w-full">
              <input
                type="checkbox"
                checked={settings.includeSnacks}
                onChange={(e) => setSettings({ ...settings, includeSnacks: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">🍪 Include Snacks</span>
            </label>
          </div>
        </div>

        {/* Pantry Items */}
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
            🏠 Already have at home? (We'll skip these)
          </p>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newPantryItem}
              onChange={(e) => setNewPantryItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPantryItem()}
              placeholder="Rice, Salt, Oil..."
              className="input flex-1 text-sm"
            />
            <button
              onClick={addPantryItem}
              className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Add
            </button>
          </div>
          {pantryItems.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pantryItems.map((item, idx) => (
                <span key={idx} className="px-2 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs rounded-full flex items-center gap-1">
                  {item}
                  <button onClick={() => removePantryItem(item)} className="hover:text-amber-600">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={generateList}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating Smart List...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Smart Grocery List
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {groceryData && groceryData.groceryList && (
        <div className="space-y-4 animate-fade-in">
          {/* Progress & Summary Bar */}
          <div className="card p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <IndianRupee className="w-6 h-6 text-emerald-600" />
                <div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Estimated Total</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                    ₹{groceryData.estimatedTotalCost?.total || groceryData.estimatedTotalCost || 0}
                  </p>
                </div>
              </div>

              {/* Shopping Progress */}
              <div className="flex-1 max-w-sm">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-600 dark:text-neutral-400">Shopping Progress</span>
                  <span className="font-semibold text-emerald-600">{progress.checked}/{progress.total} items</span>
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={exportList}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-700 text-emerald-600 dark:text-emerald-400 rounded-xl hover:shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                Export List
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            {[
              { id: 'list', label: 'Shopping List', icon: ShoppingCart },
              { id: 'route', label: 'Store Route', icon: MapPin },
              { id: 'nutrition', label: 'Nutrition', icon: Leaf }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeView === view.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-emerald-100'
                }`}
              >
                <view.icon className="w-4 h-4" />
                {view.label}
              </button>
            ))}
          </div>

          {/* Shopping List View */}
          {activeView === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groceryData.groceryList).map(([category, items]) => (
                items && items.length > 0 && (
                  <div key={category} className="card p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection(category)}
                    >
                      <h3 className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 capitalize">
                        <span>{getCategoryEmoji(category)}</span>
                        {category}
                        <span className="text-sm font-normal text-neutral-500">({items.length})</span>
                      </h3>
                      {expandedSections[category] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                    
                    <div className={`space-y-2 mt-3 ${expandedSections[category] === false ? 'hidden' : ''}`}>
                      {items.map((item, idx) => {
                        const key = `${category}-${item.item}`;
                        const isChecked = checkedItems[key];
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleItem(category, item.item)}
                            className={`p-3 rounded-xl cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-green-100 dark:bg-green-900/30 line-through opacity-60'
                                : 'bg-neutral-50 dark:bg-neutral-700/50 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-2">
                                <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isChecked
                                    ? 'bg-green-500 border-green-500'
                                    : 'border-neutral-300 dark:border-neutral-600'
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.item}</span>
                                  {item.nutritionalValue && (
                                    <p className="text-xs text-neutral-500">{item.nutritionalValue}</p>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.quantity}</p>
                                <p className="text-xs font-semibold text-emerald-600">₹{item.estimatedCost}</p>
                              </div>
                            </div>
                            
                            {/* Item Details */}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.priority && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
                                  {item.priority}
                                </span>
                              )}
                              {item.seasonal && (
                                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                  🌿 Seasonal
                                </span>
                              )}
                              {item.organicAvailable && settings.prioritizeOrganic && (
                                <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full">
                                  🌱 Organic
                                </span>
                              )}
                              {item.shelfLife && (
                                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {item.shelfLife}
                                </span>
                              )}
                            </div>

                            {/* Alternatives */}
                            {item.alternatives && item.alternatives.length > 0 && (
                              <p className="text-xs text-neutral-400 mt-1">
                                Alt: {item.alternatives.slice(0, 2).join(', ')}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {/* Store Route View */}
          {activeView === 'route' && groceryData.shoppingRoute && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Optimized Shopping Route
                {groceryData.shoppingRoute.totalShoppingTime && (
                  <span className="text-sm font-normal text-neutral-500">
                    (~{groceryData.shoppingRoute.totalShoppingTime})
                  </span>
                )}
              </h4>
              
              <div className="space-y-3">
                {groceryData.shoppingRoute.storeLayout?.map((section, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-800 dark:text-blue-200">{section.section}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{section.items?.join(', ')}</p>
                      {section.estimatedTime && (
                        <p className="text-xs text-blue-500 mt-1">⏱️ {section.estimatedTime}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutrition View */}
          {activeView === 'nutrition' && groceryData.nutritionSummary && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                Nutrition Summary
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
                  <p className="text-2xl font-bold text-orange-600">{groceryData.nutritionSummary.totalCalories}</p>
                  <p className="text-xs text-neutral-500">Total Calories</p>
                </div>
                {groceryData.nutritionSummary.macros && (
                  <>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                      <p className="text-2xl font-bold text-blue-600">{groceryData.nutritionSummary.macros.protein}</p>
                      <p className="text-xs text-neutral-500">Protein</p>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
                      <p className="text-2xl font-bold text-yellow-600">{groceryData.nutritionSummary.macros.carbs}</p>
                      <p className="text-xs text-neutral-500">Carbs</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                      <p className="text-2xl font-bold text-purple-600">{groceryData.nutritionSummary.macros.fats}</p>
                      <p className="text-xs text-neutral-500">Fats</p>
                    </div>
                  </>
                )}
              </div>

              {groceryData.nutritionSummary.keyNutrients && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Key Nutrients</p>
                  <div className="flex flex-wrap gap-2">
                    {groceryData.nutritionSummary.keyNutrients.map((nutrient, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full">
                        ✓ {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bulk Buy Recommendations */}
          {groceryData.bulkBuyRecommendations && groceryData.bulkBuyRecommendations.length > 0 && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Bulk Buy Recommendations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {groceryData.bulkBuyRecommendations.map((rec, idx) => (
                  <div key={idx} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <p className="font-semibold text-purple-800 dark:text-purple-200">{rec.item}</p>
                    <p className="text-sm text-purple-600">{rec.currentQuantity} → {rec.recommendedQuantity}</p>
                    <p className="text-xs text-green-600 mt-1 font-semibold">Save {rec.savings}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Storage Advice */}
          {groceryData.storageAdvice && (
            <div className="card p-4">
              <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                Storage Guide
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {groceryData.storageAdvice.refrigerator && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <p className="font-medium text-blue-800 dark:text-blue-200 mb-2">❄️ Refrigerator</p>
                    <p className="text-sm text-blue-600">{groceryData.storageAdvice.refrigerator.join(', ')}</p>
                  </div>
                )}
                {groceryData.storageAdvice.pantry && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                    <p className="font-medium text-amber-800 dark:text-amber-200 mb-2">🏠 Pantry</p>
                    <p className="text-sm text-amber-600">{groceryData.storageAdvice.pantry.join(', ')}</p>
                  </div>
                )}
                {groceryData.storageAdvice.freezer && (
                  <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                    <p className="font-medium text-cyan-800 dark:text-cyan-200 mb-2">🧊 Freezer</p>
                    <p className="text-sm text-cyan-600">{groceryData.storageAdvice.freezer.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Meal Suggestions */}
          {groceryData.mealSuggestions && groceryData.mealSuggestions.length > 0 && (
            <div className="card p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">🍽️ Meal Ideas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {groceryData.mealSuggestions.map((meal, idx) => (
                  <div key={idx} className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                    {typeof meal === 'string' ? (
                      <p className="text-primary-700 dark:text-primary-300">{meal}</p>
                    ) : (
                      <>
                        <p className="font-medium text-primary-800 dark:text-primary-200">{meal.meal}</p>
                        {meal.day && <p className="text-xs text-primary-600">{meal.day}</p>}
                        {meal.prepTime && <p className="text-xs text-neutral-500">⏱️ {meal.prepTime}</p>}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shopping Tips */}
          {groceryData.shoppingTips && groceryData.shoppingTips.length > 0 && (
            <div className="card p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">💡 Smart Shopping Tips</h3>
              <ul className="space-y-1">
                {groceryData.shoppingTips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                    <span className="text-emerald-500 mt-1">•</span>
                    {tip}
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

export default SmartGroceryList;
