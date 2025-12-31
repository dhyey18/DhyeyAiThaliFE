import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

const UploadSection = ({ onImageSelect, onAnalyze, selectedImage, loading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [dietaryPreference, setDietaryPreference] = useState('Standard');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageSelect(file);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeClick = () => {
    if (selectedImage) {
      onAnalyze(selectedImage, dietaryPreference);
    }
  };

  const imageUrl = selectedImage ? URL.createObjectURL(selectedImage) : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dietary Preference
        </label>
        <select
          value={dietaryPreference}
          onChange={(e) => setDietaryPreference(e.target.value)}
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="Standard">Standard</option>
          <option value="Jain">Jain</option>
          <option value="Vegan">Vegan</option>
          <option value="Keto">Keto</option>
          <option value="High Protein">High Protein</option>
        </select>
      </div>
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 transition-all ${
          dragActive
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-300 bg-white hover:border-orange-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {imageUrl ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-gray-100">
              <img
                src={imageUrl}
                alt="Selected"
                className="w-full h-auto max-h-64 sm:max-h-80 lg:max-h-96 object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleButtonClick}
                className="flex-1 px-4 py-2.5 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Change Image
              </button>
              <button
                onClick={handleAnalyzeClick}
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Analyzing...</span>
                    <span className="sm:hidden">Analyzing</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Analyze Plate</span>
                    <span className="sm:hidden">Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 sm:py-6">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="p-3 sm:p-4 bg-orange-100 rounded-full">
                <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
              Drop your Thali image here
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              or click to browse
            </p>
            <button
              onClick={handleButtonClick}
              className="px-5 sm:px-6 py-2 text-sm sm:text-base bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Select Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;

