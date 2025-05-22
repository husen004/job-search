import React from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Загрузка...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      <p className="mt-3 text-gray-600">{message}</p>
    </div>
  );
};

export default Loading;