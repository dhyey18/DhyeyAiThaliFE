import { useState } from 'react';
import axios from 'axios';
import { ChefHat, Plus, Trash2, Clock, Users, Sparkles, RefreshCw } from 'lucide-react';
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
    maxPrepTime: 60
  });
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const addIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
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

    try {
      const response = await axios.post(`${API_BASE}/ai/recipe`, {
        ingredients,
        ...settings
      });
      setRecipes(response.data.recipes || []);
    } catch (error) {
      console.error('Error generating recipes:', error);
      alert('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickIngredients = ['Rice', 'Paneer', 'Tomatoes', 'Onion', 'Potato', 'Dal', 'Chicken', 'Eggs'];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">AI Recipe Generator</h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Enter ingredients, get recipes!</p>
          </div>
        </div>

        {/* Ingredient Input */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Add Ingredients
          </label>
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
        </div>

        {/* Quick Add */}
        <div className="mb-4">
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

        {/* Selected Ingredients */}
        {ingredients.length > 0 && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
              Your Ingredients ({ingredients.length}):
            </p>
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

        {/* Settings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Diet</label>
            <select
              value={settings.dietaryPreference}
              onChange={(e) => setSettings({ ...settings, dietaryPreference: e.target.value })}
              className="select w-full text-sm"
            >
              <option value="Standard">Standard</option>
              <option value="Jain">Jain</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
            </select>
          </div>
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
            <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Max Time</label>
            <select
              value={settings.maxPrepTime}
              onChange={(e) => setSettings({ ...settings, maxPrepTime: parseInt(e.target.value) })}
              className="select w-full text-sm"
            >
              <option value={15}>15 mins</option>
              <option value={30}>30 mins</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateRecipes}
          disabled={loading || ingredients.length === 0}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-neutral-400 disabled:to-neutral-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating Recipes...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Recipes
            </>
          )}
        </button>
      </div>

      {/* Recipes List */}
      {recipes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recipes.map((recipe, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedRecipe(recipe)}
              className={`card p-4 cursor-pointer hover:shadow-large transition-all duration-300 ${
                selectedRecipe?.name === recipe.name ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-2">{recipe.name}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{recipe.description}</p>
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {recipe.prepTime}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {recipe.servings} servings
                </span>
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

      {/* Selected Recipe Detail */}
      {selectedRecipe && (
        <div className="card p-6">
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">{selectedRecipe.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Ingredients</h4>
              <ul className="space-y-1">
                {selectedRecipe.ingredients?.map((ing, i) => (
                  <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400">
                    • {ing.quantity} {ing.item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 mb-2">Instructions</h4>
              <ol className="space-y-2">
                {selectedRecipe.instructions?.map((step, i) => (
                  <li key={i} className="text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-primary-500">{i + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {selectedRecipe.tips && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">💡 Chef's Tip: {selectedRecipe.tips}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecipeGenerator;
