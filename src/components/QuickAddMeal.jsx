import { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save } from 'lucide-react';
import { API_BASE } from '../config';

const QuickAddMeal = ({ onSave }) => {
  const [mealType, setMealType] = useState('Lunch');
  const [dietaryPreference, setDietaryPreference] = useState('Standard');
  const [items, setItems] = useState([{ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 }]);
  const [saving, setSaving] = useState(false);

  const addItem = () => {
    setItems([...items, { name: '', calories: 0, protein: 0, carbs: 0, fats: 0 }]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'name' ? value : parseFloat(value) || 0;
    setItems(newItems);
  };

  const calculateTotals = () => {
    return items.reduce((acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fats: acc.fats + (item.fats || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const handleSave = async () => {
    const totals = calculateTotals();
    if (totals.calories === 0) {
      alert('Please add at least one food item with calories');
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_BASE}/meals/quick-add`, {
        items: items.filter(item => item.name.trim() !== ''),
        total_calories: totals.calories,
        macros_summary: {
          protein: totals.protein,
          carbs: totals.carbs,
          fats: totals.fats
        },
        mealType,
        dietaryPreference,
        advice: 'Manually added meal'
      });
      alert('Meal saved successfully!');
      setItems([{ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 }]);
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Failed to save meal');
    } finally {
      setSaving(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">Quick Add Meal</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dietary Preference</label>
          <select
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option>Standard</option>
            <option>Jain</option>
            <option>Vegan</option>
            <option>Keto</option>
            <option>High Protein</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Food Items</h3>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 dark:bg-orange-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="col-span-12 sm:col-span-3">
              <input
                type="text"
                placeholder="Food name"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <input
                type="number"
                placeholder="Cal"
                value={item.calories || ''}
                onChange={(e) => updateItem(index, 'calories', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <input
                type="number"
                placeholder="P (g)"
                value={item.protein || ''}
                onChange={(e) => updateItem(index, 'protein', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <input
                type="number"
                placeholder="C (g)"
                value={item.carbs || ''}
                onChange={(e) => updateItem(index, 'carbs', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="col-span-5 sm:col-span-2">
              <input
                type="number"
                placeholder="F (g)"
                value={item.fats || ''}
                onChange={(e) => updateItem(index, 'fats', e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="col-span-1">
              <button
                onClick={() => removeItem(index)}
                className="w-full p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-4 gap-4 text-white">
          <div>
            <p className="text-xs opacity-90">Total Calories</p>
            <p className="text-2xl font-bold">{totals.calories.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-xs opacity-90">Protein</p>
            <p className="text-xl font-bold">{totals.protein.toFixed(1)}g</p>
          </div>
          <div>
            <p className="text-xs opacity-90">Carbs</p>
            <p className="text-xl font-bold">{totals.carbs.toFixed(1)}g</p>
          </div>
          <div>
            <p className="text-xs opacity-90">Fats</p>
            <p className="text-xl font-bold">{totals.fats.toFixed(1)}g</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || totals.calories === 0}
        className="w-full px-4 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Meal'}
      </button>
    </div>
  );
};

export default QuickAddMeal;

