import { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, TrendingUp, Salad, Activity, RefreshCw, Award, AlertTriangle, CheckCircle } from 'lucide-react';
import { API_BASE } from '../config';

const AIHealthScore = () => {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadHealthScore();
  }, [days]);

  const loadHealthScore = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/ai/health-score`, {
        params: { days }
      });
      setScoreData(response.data);
    } catch (error) {
      console.error('Error loading health score:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    if (score >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-red-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  if (loading) {
    return (
      <div className="card p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse mb-4"></div>
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-32 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!scoreData?.overallScore && scoreData?.score === null) {
    return (
      <div className="card p-8 text-center">
        <Heart className="w-16 h-16 mx-auto mb-4 text-neutral-300 dark:text-neutral-600" />
        <h3 className="text-xl font-bold text-neutral-700 dark:text-neutral-300 mb-2">
          {scoreData?.message || 'Keep Logging Meals!'}
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 mb-4">
          {scoreData?.mealsLogged || 0} / {scoreData?.mealsNeeded || 3} meals logged
        </p>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
          <div 
            className="bg-primary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((scoreData?.mealsLogged || 0) / (scoreData?.mealsNeeded || 3)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Score Card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            AI Health Score
          </h2>
          <div className="flex gap-2">
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="select text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <button
              onClick={loadHealthScore}
              className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Score Circle */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="85"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-neutral-200 dark:text-neutral-700"
              />
              <circle
                cx="96"
                cy="96"
                r="85"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(scoreData.overallScore / 100) * 534} 534`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={scoreData.overallScore >= 60 ? 'text-green-400' : 'text-orange-400'} style={{ stopColor: 'currentColor' }} />
                  <stop offset="100%" className={scoreData.overallScore >= 60 ? 'text-green-600' : 'text-red-500'} style={{ stopColor: 'currentColor' }} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-neutral-900 dark:text-neutral-100">
                {scoreData.overallScore}
              </span>
              <span className={`text-sm font-semibold bg-gradient-to-r ${getScoreColor(scoreData.overallScore)} bg-clip-text text-transparent`}>
                {getScoreLabel(scoreData.overallScore)}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {scoreData.breakdown && Object.entries(scoreData.breakdown).map(([key, data]) => (
            <div key={key} className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 capitalize">{key}</span>
                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{data.score}</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${
                    key === 'balance' ? 'from-blue-400 to-blue-600' :
                    key === 'variety' ? 'from-green-400 to-green-600' :
                    'from-purple-400 to-purple-600'
                  }`}
                  style={{ width: `${(data.score / (key === 'consistency' ? 30 : 35)) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{data.feedback}</p>
            </div>
          ))}
        </div>

        {/* Top Tip */}
        {scoreData.topTip && (
          <div className="p-4 bg-gradient-to-r from-primary-50 to-orange-50 dark:from-primary-900/20 dark:to-orange-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
            <p className="text-primary-800 dark:text-primary-200 flex items-start gap-2">
              <Award className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="font-medium">{scoreData.topTip}</span>
            </p>
          </div>
        )}
      </div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scoreData.strengths && scoreData.strengths.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {scoreData.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400">
                  <span className="text-green-500 mt-1">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {scoreData.improvements && scoreData.improvements.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {scoreData.improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400">
                  <span className="text-orange-500 mt-1">→</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Stats */}
      {scoreData.stats && (
        <div className="card p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{scoreData.stats.mealsAnalyzed}</p>
              <p className="text-xs text-neutral-500">Meals Analyzed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{scoreData.stats.daysAnalyzed}</p>
              <p className="text-xs text-neutral-500">Days</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{scoreData.stats.avgCalories}</p>
              <p className="text-xs text-neutral-500">Avg Calories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{scoreData.stats.uniqueFoodsCount}</p>
              <p className="text-xs text-neutral-500">Unique Foods</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIHealthScore;
