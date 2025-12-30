import { useState } from 'react';
import axios from 'axios';
import UploadSection from './components/UploadSection';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setData(null);
  };

  const handleAnalyze = async (imageFile) => {
    setLoading(true);
    setData(null);

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post('http://localhost:5000/analyze', formData, {
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UploadSection
            onImageSelect={handleImageSelect}
            onAnalyze={handleAnalyze}
            selectedImage={selectedImage}
            loading={loading}
          />
          <ResultsDashboard data={data} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default App;

