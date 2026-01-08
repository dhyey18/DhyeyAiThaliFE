import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lightbulb, RotateCcw, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Target, Brain } from 'lucide-react';
import { API_BASE } from '../config';

const NutritionInsights = () => {
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadInsights();
  }, [days]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/ai/insights`, {
        params: { days }
      });
      setInsightsData(response.data);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'tip': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'pattern': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'goal': return <Target className="w-5 h-5 text-purple-500" />;
      default: return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getInsightStyle = (type) => {
    switch (type) {
      case 'positive': return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800';
      case 'warning': return 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800';
      case 'tip': return 'from-yellow-50 to-primary-50 dark:from-yellow-900/20 dark:to-primary-900/20 border-yellow-200 dark:border-yellow-800';
      case 'pattern': return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800';
      case 'goal': return 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800';
      default: return 'from-yellow-50 to-primary-50 dark:from-yellow-900/20 dark:to-primary-900/20 border-yellow-200 dark:border-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-xl w-1/3"></div>
          <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
          <div className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                AI Nutrition Insights
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                Powered by Gemini AI
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="select text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
            </select>
            <button
              onClick={loadInsights}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary */}
        {insightsData?.summary && (
          <div className="mb-6 p-4 bg-gradient-to-r from-primary-100 to-orange-100 dark:from-primary-900/30 dark:to-orange-900/30 rounded-xl border border-primary-200 dark:border-primary-800">
            <p className="text-primary-800 dark:text-primary-200 font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {insightsData.summary}
            </p>
          </div>
        )}

        {/* Insights */}
        {insightsData?.insights?.length === 0 || !insightsData?.insights ? (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-neutral-300 dark:text-neutral-600" />
            <p>Not enough data to generate insights</p>
            <p className="text-sm mt-2">Start logging meals to see personalized insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insightsData.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 bg-gradient-to-r ${getInsightStyle(insight.type)} rounded-xl border animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {insight.emoji ? (
                      <span className="text-xl">{insight.emoji}</span>
                    ) : (
                      getInsightIcon(insight.type)
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm">
                      {insight.content}
                    </p>
                    {insight.action && (
                      <p className="mt-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                        → {insight.action}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {insightsData?.mealsAnalyzed > 0 && (
          <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
              Analyzed <strong>{insightsData.mealsAnalyzed}</strong> meals over{' '}
              <strong>{insightsData.daysAnalyzed}</strong> days
            </p>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          How AI Insights Work
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Our AI analyzes your meal patterns, food variety, macro balance, and eating habits using Google Gemini. 
          The more meals you log, the more personalized and accurate your insights become. 
          Each insight includes actionable recommendations tailored specifically to your nutrition journey.
        </p>
      </div>
    </div>
  );
};

export default NutritionInsights;
