import { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, History, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { API_BASE, ANALYZE_API } from './config';
import UploadSection from './components/UploadSection';
import ResultsDashboard from './components/ResultsDashboard';
import MealHistory from './components/MealHistory';
import DailyTracker from './components/DailyTracker';
import ProgressCharts from './components/ProgressCharts';
import Dashboard from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [meals, setMeals] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (activeTab === 'history' || activeTab === 'progress' || activeTab === 'goals') {
      loadMeals();
    }
  }, [activeTab, refreshKey]);

  const loadMeals = async () => {
    try {
      const response = await axios.get(`${API_BASE}/meals`, { params: { limit: 100 } });
      setMeals(response.data.meals || []);
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setData(null);
  };

  const handleAnalyze = async (imageFile, dietaryPreference = 'Standard') => {
    setLoading(true);
    setData(null);

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('dietaryPreference', dietaryPreference);

    try {
      const response = await axios.post(`${ANALYZE_API}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = () => {
    setRefreshKey(prev => prev + 1);
    loadMeals();
  };

  const handleSelectMeal = (meal) => {
    setData(meal);
    setActiveTab('analyze');
  };

  const tabs = [
    { id: 'analyze', label: 'Analyze', icon: Camera },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">
            My Thali AI
          </h1>
          <p className="mt-2 text-gray-600">AI-Powered Indian Meal Nutrition Analysis</p>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UploadSection
              onImageSelect={handleImageSelect}
              onAnalyze={handleAnalyze}
              selectedImage={selectedImage}
              loading={loading}
            />
            <ResultsDashboard 
              data={data} 
              loading={loading} 
              onSave={handleSaveMeal}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto">
            <Dashboard />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto">
            <MealHistory onSelectMeal={handleSelectMeal} />
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="max-w-6xl mx-auto">
            <ProgressCharts />
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="max-w-4xl mx-auto">
            <DailyTracker meals={meals} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

