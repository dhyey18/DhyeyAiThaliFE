import { useState } from 'react';
import axios from 'axios';
import { ChefHat, Plus, Trash2, Clock, Users, Sparkles, RefreshCw, Flame, Heart, Award, Youtube, ShoppingBag, Star, Utensils, AlertTriangle, Bookmark } from 'lucide-react';
import { API_BASE } from '../config';

const AIRecipeGenerator = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    dietaryPreference: 'Standard',
    cuisineType: 'Indian',
    mealType: 'Any',
    maxPrepTime: 60,
    skillLevel: 'intermediate',
    servings: 2,
    optimizeFor: 'balanced',
    spiceLevel: 'medium',
    healthGoal: '',
    useLeftovers: false
  });
  const [allergies, setAllergies] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [extraData, setExtraData] = useState(null);
  const [activeTab, setActiveTab] = useState('ingredients');

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const toggleAllergy = (allergy) => {
    setAllergies(prev =>
      prev.includes(allergy)
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const generateRecipes = async () => {
    if (ingredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setRecipes([]);
    setSelectedRecipe(null);
    setExtraData(null);

    try {
      const response = await axios.post(`${API_BASE}/ai/recipe`, {
        ingredients,
        ...settings,
        allergies
      });
      setRecipes(response.data.recipes || []);
      setExtraData({
        ingredientUsage: response.data.ingredientUsage,
        shoppingList: response.data.shoppingListForMissing,
        nutritionComparison: response.data.nutritionComparison,
        mealPlanSuggestion: response.data.mealPlanSuggestion,
        aiChefNote: response.data.aiChefNote
      });
    } catch (error) {
      console.error('Error generating recipes:', error);
      alert('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickIngredients = ['Rice', 'Paneer', 'Tomatoes', 'Onion', 'Potato', 'Dal', 'Chicken', 'Eggs', 'Spinach', 'Chickpeas'];
  const commonAllergies = ['Dairy', 'Gluten', 'Nuts', 'Eggs', 'Soy', 'Shellfish'];

  const getDifficultyColor = (diff) => {
    if (!diff) return 'bg-neutral-100 text-neutral-700';
    switch (diff.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`} />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">AI Recipe Generator</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Smart recipes with health insights & variations</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-700">
          {[
            { id: 'ingredients', label: 'Ingredients', icon: Utensils },
            { id: 'preferences', label: 'Preferences', icon: Flame },
            { id: 'health', label: 'Health & Diet', icon: Heart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 font-medium transition-all border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Ingredients Tab */}
        {activeTab === 'ingredients' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type ingredient and press Enter..."
                className="flex-1 input"
              />
              <button
                onClick={addIngredient}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Quick Add:</p>
              <div className="flex flex-wrap gap-2">
                {quickIngredients.map((item) => (
                  <button
                    key={item}
                    onClick={() => !ingredients.includes(item) && setIngredients([...ingredients, item])}
                    disabled={ingredients.includes(item)}
                    className="px-3 py-1 text-xs bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 disabled:opacity-50 transition-colors"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>

            {ingredients.length > 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                    Your Ingredients ({ingredients.length}):
                  </p>
                  <label className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                    <input
                      type="checkbox"
                      checked={settings.useLeftovers}
                      onChange={(e) => setSettings({ ...settings, useLeftovers: e.target.checked })}
                      className="rounded"
                    />
                    Use as leftovers
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded-full flex items-center gap-1"
                    >
                      {item}
                      <button onClick={() => removeIngredient(idx)} className="hover:text-green-200">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Cuisine</label>
              <select
                value={settings.cuisineType}
                onChange={(e) => setSettings({ ...settings, cuisineType: e.target.value })}
                className="select w-full text-sm"
              >
                <option value="Indian">Indian</option>
                <option value="South Indian">South Indian</option>
                <option value="North Indian">North Indian</option>
                <option value="Indo-Chinese">Indo-Chinese</option>
                <option value="Mughlai">Mughlai</option>
                <option value="Street Food">Street Food</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Meal Type</label>
              <select
                value={settings.mealType}
                onChange={(e) => setSettings({ ...settings, mealType: e.target.value })}
                className="select w-full text-sm"
              >
                <option value="Any">Any</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Skill Level</label>
              <select
                value={settings.skillLevel}
                onChange={(e) => setSettings({ ...settings, skillLevel: e.target.value })}
                className="select w-full text-sm"
              >
                <option value="beginner">🔰 Beginner</option>
                <option value="intermediate">👨‍🍳 Intermediate</option>
                <option value="advanced">⭐ Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Spice Level</label>
              <select
                value={settings.spiceLevel}
                onChange={(e) => setSettings({ ...settings, spiceLevel: e.target.value })}
                className="select w-full text-sm"
              >
                <option value="mild">🌶️ Mild</option>
                <option value="medium">🌶️🌶️ Medium</option>
                <option value="spicy">🌶️🌶️🌶️ Spicy</option>
                <option value="extraSpicy">🔥 Extra Spicy</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Max Time</label>
              <select
                value={settings.maxPrepTime}
                onChange={(e) => setSettings({ ...settings, maxPrepTime: parseInt(e.target.value) })}
                className="select w-full text-sm"
              >
                <option value={15}>⚡ 15 mins</option>
                <option value={30}>🕐 30 mins</option>
                <option value={60}>🕐 1 hour</option>
                <option value={120}>🕑 2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Servings</label>
              <select
                value={settings.servings}
                onChange={(e) => setSettings({ ...settings, servings: parseInt(e.target.value) })}
                className="select w-full text-sm"
              >
                <option value={1}>1 Person</option>
                <option value={2}>2 People</option>
                <option value={4}>4 People</option>
                <option value={6}>6 People</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Optimize For</label>
              <select
                value={settings.optimizeFor}
                onChange={(e) => setSettings({ ...settings, optimizeFor: e.target.value })}
                className="select w-full text-sm"
              >
                <option value="balanced">⚖️ Balanced</option>
                <option value="protein">💪 High Protein</option>
                <option value="lowCarb">🥗 Low Carb</option>
                <option value="lowFat">🍃 Low Fat</option>
                <option value="fiber">🌾 High Fiber</option>
              </select>
            </div>
          </div>
        )}

        {/* Health & Diet Tab */}
        {activeTab === 'health' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Diet</label>
                <select
                  value={settings.dietaryPreference}
                  onChange={(e) => setSettings({ ...settings, dietaryPreference: e.target.value })}
                  className="select w-full"
                >
                  <option value="Standard">Standard</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Jain">Jain</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                  <option value="High Protein">High Protein</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Health Goal</label>
                <select
                  value={settings.healthGoal}
                  onChange={(e) => setSettings({ ...settings, healthGoal: e.target.value })}
                  className="select w-full"
                >
                  <option value="">No specific goal</option>
                  <option value="weightLoss">🔥 Weight Loss</option>
                  <option value="muscleGain">💪 Muscle Gain</option>
                  <option value="energy">⚡ Energy Boost</option>
                  <option value="immunity">🛡️ Immunity</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
                Allergies to Avoid
              </label>
              <div className="flex flex-wrap gap-2">
                {commonAllergies.map((allergy) => (
                  <button
                    key={allergy}
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      allergies.includes(allergy)
                        ? 'bg-red-500 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-red-100'
                    }`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
              {allergies.length > 0 && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Recipes will exclude: {allergies.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={generateRecipes}
          disabled={loading || ingredients.length === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating {settings.servings}-serving recipes...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Smart Recipes
            </>
          )}
        </button>
      </div>

      {/* AI Chef Note */}
      {extraData?.aiChefNote && (
        <div className="card p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            👨‍🍳 <strong>Chef's Note:</strong> {extraData.aiChefNote}
          </p>
        </div>
      )}

      {/* Recipe Cards */}
      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recipes.map((recipe, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedRecipe(recipe)}
              className={`card p-4 cursor-pointer hover:shadow-large transition-all duration-300 ${
                selectedRecipe?.name === recipe.name ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 line-clamp-1">{recipe.name}</h3>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              </div>
              {recipe.hindiName && (
                <p className="text-xs text-neutral-500 italic mb-2">({recipe.hindiName})</p>
              )}
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">{recipe.description}</p>
              
              <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {recipe.totalTime || recipe.prepTime}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {recipe.servings}
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3" /> {recipe.spiceLevel}
                </span>
              </div>

              {/* Rating */}
              {recipe.rating && (
                <div className="flex gap-2 mb-3">
                  <div className="flex items-center gap-1" title="Taste">
                    <span className="text-xs">😋</span>
                    {renderRatingStars(recipe.rating.taste)}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1">
                {recipe.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-lg">
                  {recipe.nutrition?.calories} kcal
                </span>
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-lg">
                  {recipe.nutrition?.protein}g protein
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nutrition Comparison */}
      {extraData?.nutritionComparison && (
        <div className="card p-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Recipe Comparison
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
              <p className="text-xs text-blue-600 dark:text-blue-400">💪 Best for Protein</p>
              <p className="font-semibold text-blue-800 dark:text-blue-200">{extraData.nutritionComparison.bestForProtein}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
              <p className="text-xs text-green-600 dark:text-green-400">🔥 Lowest Calories</p>
              <p className="font-semibold text-green-800 dark:text-green-200">{extraData.nutritionComparison.lowestCalories}</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
              <p className="text-xs text-purple-600 dark:text-purple-400">⚖️ Most Balanced</p>
              <p className="font-semibold text-purple-800 dark:text-purple-200">{extraData.nutritionComparison.mostBalanced}</p>
            </div>
          </div>
        </div>
      )}

      {/* Selected Recipe Detail */}
      {selectedRecipe && (
        <div className="card p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{selectedRecipe.name}</h3>
              {selectedRecipe.hindiName && (
                <p className="text-neutral-500 italic">{selectedRecipe.hindiName}</p>
              )}
            </div>
            <div className="flex gap-2">
              {selectedRecipe.videoKeywords && (
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedRecipe.videoKeywords)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  <Youtube className="w-4 h-4" /> Tutorial
                </a>
              )}
              <button className="flex items-center gap-1 px-3 py-1.5 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors text-sm">
                <Bookmark className="w-4 h-4" /> Save
              </button>
            </div>
          </div>

          {/* Health Benefits */}
          {selectedRecipe.healthBenefits && (
            <div className="flex flex-wrap gap-2">
              {selectedRecipe.healthBenefits.map((benefit, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm rounded-full flex items-center gap-1">
                  <Heart className="w-3 h-3" /> {benefit}
                </span>
              ))}
            </div>
          )}

          {/* Allergens Warning */}
          {selectedRecipe.allergens && selectedRecipe.allergens.length > 0 && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Contains: {selectedRecipe.allergens.join(', ')}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div>
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">📝 Ingredients</h4>
              <ul className="space-y-2">
                {selectedRecipe.ingredients?.map((ing, i) => (
                  <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                    <span className="w-5 h-5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-xs shrink-0">
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-medium">{ing.quantity}</span> {ing.item}
                      {ing.preparation && <span className="text-neutral-400"> ({ing.preparation})</span>}
                      {ing.substitute && (
                        <p className="text-xs text-neutral-400 mt-0.5">🔄 Sub: {ing.substitute}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-3">👨‍🍳 Instructions</h4>
              <ol className="space-y-3">
                {selectedRecipe.instructions?.map((step, i) => (
                  <li key={i} className="text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-primary-500">{step.step || i + 1}.</span>
                      <div>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          {step.instruction || step}
                        </p>
                        {step.tip && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                            💡 {step.tip}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Nutrition Details */}
          {selectedRecipe.nutrition && (
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {Object.entries(selectedRecipe.nutrition).map(([key, value]) => (
                <div key={key} className="p-2 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg text-center">
                  <p className="text-xs text-neutral-500 capitalize">{key}</p>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100">
                    {value}{key === 'calories' ? '' : 'g'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Variations */}
          {selectedRecipe.variations && selectedRecipe.variations.length > 0 && (
            <div>
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">🔄 Variations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {selectedRecipe.variations.map((v, i) => (
                  <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <p className="font-medium text-purple-800 dark:text-purple-200">{v.name}</p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">{v.change}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meal Prep & Serving */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedRecipe.mealPrepTips && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  📦 <strong>Meal Prep:</strong> {selectedRecipe.mealPrepTips}
                </p>
              </div>
            )}
            {selectedRecipe.servingSuggestions && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm text-green-800 dark:text-green-200">
                  🍽️ <strong>Serve with:</strong> {selectedRecipe.servingSuggestions}
                </p>
              </div>
            )}
          </div>

          {selectedRecipe.tips && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">💡 <strong>Chef's Tip:</strong> {selectedRecipe.tips}</p>
            </div>
          )}
        </div>
      )}

      {/* Shopping List for Missing Items */}
      {extraData?.shoppingList && extraData.shoppingList.length > 0 && (
        <div className="card p-4">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-500" />
            Shopping List for Missing Items
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {extraData.shoppingList.map((item, idx) => (
              <div key={idx} className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <p className="font-medium text-emerald-800 dark:text-emerald-200">{item.item}</p>
                <p className="text-xs text-emerald-600">{item.quantity} • ₹{item.estimatedCost}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecipeGenerator;
