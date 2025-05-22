import React from 'react';

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

const Error: React.FC<ErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p className="font-medium">Ошибка:</p>
      <p className="mt-1">{message}</p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-3 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Попробовать снова
        </button>
      )}
    </div>
  );
};

export default Error;