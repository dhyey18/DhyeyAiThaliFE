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
    <div className="space-y-6">
      <div className="card p-5">
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
          Dietary Preference
        </label>
        <select
          value={dietaryPreference}
          onChange={(e) => setDietaryPreference(e.target.value)}
          className="select"
        >
          <option value="Standard">Standard</option>
          <option value="Jain">Jain</option>
          <option value="Vegan">Vegan</option>
          <option value="Keto">Keto</option>
          <option value="High Protein">High Protein</option>
        </select>
      </div>
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 lg:p-12 transition-all duration-300 ${
          dragActive
            ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20 scale-[1.01]'
            : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-neutral-50 dark:hover:bg-neutral-700/30'
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
          <div className="space-y-4 animate-fade-in">
            <div className="relative rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 shadow-medium">
              <img
                src={imageUrl}
                alt="Selected"
                className="w-full h-auto max-h-64 sm:max-h-80 lg:max-h-96 object-contain"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleButtonClick}
                className="flex-1 px-4 py-3 btn-secondary"
              >
                Change Image
              </button>
              <button
                onClick={handleAnalyzeClick}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 disabled:hover:shadow-md"
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
          <div className="text-center py-8 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-2xl shadow-soft">
                <ImageIcon className="w-12 h-12 sm:w-14 sm:h-14 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
              Drop your Thali image here
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              or click to browse
            </p>
            <button
              onClick={handleButtonClick}
              className="btn-primary px-6 py-3"
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

