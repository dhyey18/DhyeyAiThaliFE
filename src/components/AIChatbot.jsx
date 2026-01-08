import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { API_BASE } from '../config';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm Thali AI, your personal Indian nutrition assistant 🍛 Ask me anything about nutrition, Indian foods, or healthy eating!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickQuestions = [
    "What are high-protein Indian foods?",
    "How can I make dal more nutritious?",
    "Healthy breakfast ideas?",
    "Low-carb Indian dinner options?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText = input) => {
    if (!messageText.trim() || loading) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/ai/chat`, {
        message: messageText,
        conversationHistory: messages.slice(-6)
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.message
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble responding right now. Please try again! 🙏"
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! How can I help you with nutrition today? 🍛"
    }]);
  };

  return (
    <div className="card overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Thali AI Assistant</h2>
            <p className="text-primary-100 text-sm">Your nutrition expert 🇮🇳</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
          title="Clear chat"
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-neutral-800">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === 'user'
                ? 'bg-primary-500 text-white'
                : 'bg-gradient-to-br from-green-400 to-primary-500 text-white'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-primary-500 text-white rounded-tr-sm'
                : 'bg-white dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-tl-sm shadow-soft'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-primary-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-white dark:bg-neutral-700 p-3 rounded-2xl rounded-tl-sm shadow-soft">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 2 && (
        <div className="px-4 py-3 bg-neutral-100 dark:bg-neutral-700/50 border-t border-neutral-200 dark:border-neutral-600">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 text-xs bg-white dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about nutrition..."
            className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-700 rounded-xl border-0 focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-600 text-white rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
