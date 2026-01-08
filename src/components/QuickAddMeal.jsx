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
    <div className="card p-6">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Quick Add Meal</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Meal Type</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="select"
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Dietary Preference</label>
          <select
            value={dietaryPreference}
            onChange={(e) => setDietaryPreference(e.target.value)}
            className="select"
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
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Food Items</h3>
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
            <div className="col-span-12 sm:col-span-3">
              <input
                type="text"
                placeholder="Food name"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                className="input text-sm py-2"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <input
                type="number"
                placeholder="Cal"
                value={item.calories || ''}
                onChange={(e) => updateItem(index, 'calories', e.target.value)}
                className="input text-sm py-2"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <input
                type="number"
                placeholder="P (g)"
                value={item.protein || ''}
                onChange={(e) => updateItem(index, 'protein', e.target.value)}
                className="input text-sm py-2"
              />
            </div>
            <div className="col-span-6 sm:col-span-2">
              <input
                type="number"
                placeholder="C (g)"
                value={item.carbs || ''}
                onChange={(e) => updateItem(index, 'carbs', e.target.value)}
                className="input text-sm py-2"
              />
            </div>
            <div className="col-span-5 sm:col-span-2">
              <input
                type="number"
                placeholder="F (g)"
                value={item.fats || ''}
                onChange={(e) => updateItem(index, 'fats', e.target.value)}
                className="input text-sm py-2"
              />
            </div>
            <div className="col-span-1">
              <button
                onClick={() => removeItem(index)}
                className="w-full p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-6 shadow-medium">
        <div className="grid grid-cols-4 gap-4 text-white">
          <div>
            <p className="text-xs opacity-90 mb-1">Total Calories</p>
            <p className="text-3xl font-bold">{totals.calories.toFixed(0)}</p>
          </div>
          <div>
            <p className="text-xs opacity-90 mb-1">Protein</p>
            <p className="text-2xl font-bold">{totals.protein.toFixed(1)}g</p>
          </div>
          <div>
            <p className="text-xs opacity-90 mb-1">Carbs</p>
            <p className="text-2xl font-bold">{totals.carbs.toFixed(1)}g</p>
          </div>
          <div>
            <p className="text-xs opacity-90 mb-1">Fats</p>
            <p className="text-2xl font-bold">{totals.fats.toFixed(1)}g</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving || totals.calories === 0}
        className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 disabled:hover:shadow-md"
      >
        <Save className="w-5 h-5" />
        {saving ? 'Saving...' : 'Save Meal'}
      </button>
    </div>
  );
};

export default QuickAddMeal;

