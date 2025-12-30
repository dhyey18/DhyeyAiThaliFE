import { Activity, Zap, Apple } from 'lucide-react';

const ResultsDashboard = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 text-center">
        <p className="text-gray-500">Upload an image to see nutrition analysis</p>
      </div>
    );
  }

  const { items = [], total_calories = 0, macros_summary = {}, advice = '' } = data;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Total Calories</h2>
        <p className="text-5xl font-bold">{total_calories.toFixed(0)}</p>
        <p className="text-orange-100 mt-2">kcal</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-medium text-gray-600">Protein</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {macros_summary.protein?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-gray-500">grams</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-medium text-gray-600">Carbs</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {macros_summary.carbs?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-gray-500">grams</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Apple className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-medium text-gray-600">Fats</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {macros_summary.fats?.toFixed(1) || '0.0'}
          </p>
          <p className="text-xs text-gray-500">grams</p>
        </div>
      </div>

      {items && items.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Food Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Item</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Calories</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Protein</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Carbs</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Fats</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">{item.calories?.toFixed(0) || '0'}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">{item.protein?.toFixed(1) || '0.0'}g</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">{item.carbs?.toFixed(1) || '0.0'}g</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">{item.fats?.toFixed(1) || '0.0'}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {advice && (
        <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-xl shadow-sm p-6 border border-green-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-green-600">💡</span>
            AI Nutrition Advice
          </h3>
          <p className="text-gray-700 leading-relaxed">{advice}</p>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;

