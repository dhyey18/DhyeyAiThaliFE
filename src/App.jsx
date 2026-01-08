import { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, History, TrendingUp, Target, BarChart3, Menu, X, Moon, Sun, FileText, Lightbulb, Plus, Star, MessageCircle, Sparkles, Heart, Calendar } from 'lucide-react';
import { API_BASE, ANALYZE_API } from './config';
import UploadSection from './components/UploadSection';
import ResultsDashboard from './components/ResultsDashboard';
import MealHistory from './components/MealHistory';
import DailyTracker from './components/DailyTracker';
import ProgressCharts from './components/ProgressCharts';
import Dashboard from './components/Dashboard';
import WeeklySummary from './components/WeeklySummary';
import NutritionInsights from './components/NutritionInsights';
import QuickAddMeal from './components/QuickAddMeal';
import MealFavorites from './components/MealFavorites';
import AIChatbot from './components/AIChatbot';
import MealSuggestions from './components/MealSuggestions';
import AIHealthScore from './components/AIHealthScore';
import AIMealPlanner from './components/AIMealPlanner';

function App() {
  const [activeTab, setActiveTab] = useState('analyze');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [meals, setMeals] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

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
    { id: 'ai-chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'suggestions', label: 'Suggestions', icon: Sparkles },
    // { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'meal-plan', label: 'Meal Plan', icon: Calendar },
    { id: 'history', label: 'History', icon: History },
    // { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
    // { id: 'quick-add', label: 'Quick Add', icon: Plus },
    // { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'weekly', label: 'Weekly', icon: FileText },
    { id: 'insights', label: 'AI Insights', icon: Lightbulb },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-700 shadow-soft transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg sm:text-xl">T</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  My Thali AI
                </h1>
                <p className="hidden sm:block text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">AI-Powered Nutrition Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200 hover:scale-105 active:scale-95"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="sticky top-16 sm:top-20 z-40 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden lg:flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
          
          {mobileMenuOpen && (
            <nav className="lg:hidden py-3 border-t border-neutral-200 dark:border-neutral-700 animate-fade-in">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          )}
          
          <div className="lg:hidden overflow-x-auto py-3 scrollbar-hide">
            <div className="flex gap-2 px-1 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary-500 dark:bg-primary-600 text-white shadow-md'
                        : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
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

        {activeTab === 'quick-add' && (
          <div className="max-w-4xl mx-auto">
            <QuickAddMeal onSave={handleSaveMeal} />
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="max-w-4xl mx-auto">
            <MealFavorites onSelectMeal={handleSelectMeal} onSave={handleSaveMeal} currentMeal={data} />
          </div>
        )}

        {activeTab === 'weekly' && (
          <div className="max-w-6xl mx-auto">
            <WeeklySummary />
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="max-w-4xl mx-auto">
            <NutritionInsights />
          </div>
        )}

        {activeTab === 'ai-chat' && (
          <div className="max-w-3xl mx-auto">
            <AIChatbot />
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="max-w-5xl mx-auto">
            <MealSuggestions onSave={handleSaveMeal} />
          </div>
        )}

        {activeTab === 'health' && (
          <div className="max-w-4xl mx-auto">
            <AIHealthScore />
          </div>
        )}

        {activeTab === 'meal-plan' && (
          <div className="max-w-5xl mx-auto">
            <AIMealPlanner />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

