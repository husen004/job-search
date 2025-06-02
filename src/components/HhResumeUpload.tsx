// filepath: src/components/HhResumeUpload.tsx
import React, { useState } from 'react';
import { Analytics } from '../utils/analytics';

interface ResumeUploadProps {
  vacancyId: string;
  onClose: () => void;
}

/**
 * Component for uploading resume to apply for a vacancy
 */
const HhResumeUpload: React.FC<ResumeUploadProps> = ({ vacancyId, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Reset error state
    setError(null);
    
    // Check file type
    if (
      selectedFile.type !== 'application/pdf' && 
      !selectedFile.type.includes('word') &&
      selectedFile.type !== 'application/rtf'
    ) {
      setError('Пожалуйста, загрузите файл в формате PDF, DOC, DOCX или RTF');
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }
    
    // Set the file for upload
    setFile(selectedFile);
    
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Пожалуйста, загрузите резюме');
      return;
    }
    
    // Set loading state
    setIsLoading(true);
      try {
      // Call the HeadHunter service to apply for the vacancy
      const result = await HeadHunterService.applyToVacancy({
        vacancyId,
        resumeFile: file,
        coverLetter: coverLetter
      });
        if (!result.success) {
        throw new Error(result.message);
      }
      
      // Track job application
      Analytics.trackJobApplication(
        vacancyId, 
        "Вакансия", // Ideally we would have the vacancy title here
        coverLetter.length > 0
      );
      
      // Set success state
      setSuccess(true);
      
      // Reset form after successful submission
      setFile(null);
      setCoverLetter('');
      
      // Close the modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error applying for vacancy:', err);
      setError('Произошла ошибка при отправке резюме. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Отклик на вакансию</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              ✕
            </button>
          </div>
          
          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p className="font-semibold">Резюме успешно отправлено!</p>
              <p className="text-sm mt-1">Работодатель получит ваше резюме и свяжется с вами.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">Загрузите резюме (PDF, DOC, DOCX, RTF)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/rtf"
                  onChange={handleFileChange}
                  className="block w-full border border-gray-300 rounded py-2 px-3"
                  disabled={isLoading}
                />
                {file && (
                  <p className="text-sm text-gray-600 mt-1">
                    Выбранный файл: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">Сопроводительное письмо (не обязательно)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="block w-full border border-gray-300 rounded py-2 px-3 h-32"
                  placeholder="Расскажите о своем опыте и почему вы подходите для этой должности..."
                  disabled={isLoading}
                ></textarea>
              </div>
              
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded font-medium ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Отправка...' : 'Отправить резюме'}
              </button>
              
              <p className="text-sm text-gray-500 mt-3">
                Нажимая «Отправить резюме», вы соглашаетесь с правилами использования сервиса и даете согласие на обработку персональных данных.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HhResumeUpload;
