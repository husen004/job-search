import React from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/slices/toastSlice';

const HhSavedVacancies = () => {
  const dispatch = useDispatch();

  const handleSaveVacancy = () => {
    dispatch(addToast({
      message: 'Вакансия успешно сохранена!',
      type: 'success',
      duration: 3000
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Сохраненные вакансии</h2>
      <button 
        onClick={handleSaveVacancy}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Сохранить вакансию
      </button>
    </div>
  );
}
export default HhSavedVacancies;