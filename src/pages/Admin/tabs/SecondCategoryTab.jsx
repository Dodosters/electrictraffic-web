import React, { useState, useEffect } from 'react';
import CoefficientFormSection from '../components/CoefficientFormSection';
import { getSecondCategoryCoefficients, updateSecondCategoryCoefficients } from '../../../api/coefficientsAPI';

const SecondCategoryTab = () => {
  const [coefficients, setCoefficients] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCoefficients();
  }, []);

  const fetchCoefficients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSecondCategoryCoefficients();
      // Ensure all values are properly converted to numbers
      processNumericValues(data);
      setCoefficients(data);
    } catch (err) {
      setError('Ошибка загрузки коэффициентов: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to ensure all numeric values are properly typed
  const processNumericValues = (obj) => {
    if (!obj) return;
    
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      
      if (typeof value === 'string' && !isNaN(parseFloat(value))) {
        obj[key] = parseFloat(value);
      } else if (typeof value === 'object' && value !== null) {
        processNumericValues(value);
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      await updateSecondCategoryCoefficients(coefficients);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Ошибка сохранения коэффициентов: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (path, value) => {
    setCoefficients((prev) => {
      if (!prev) return prev;
      
      const newCoefficients = { ...prev };
      const keys = path.split('.');
      let current = newCoefficients;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newCoefficients;
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mb-3" role="alert">
        {error}
        <button onClick={fetchCoefficients} className="btn btn-outline-danger btn-sm ms-3">
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!coefficients) {
    return (
      <div className="alert alert-warning" role="alert">
        Данные не найдены
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Коэффициенты Второй Категории</h2>
      
      {success && (
        <div className="alert alert-success mb-4" role="alert">
          Коэффициенты успешно сохранены!
        </div>
      )}
      
      <CoefficientFormSection 
        title="До 670 кВт·ч" 
        data={coefficients.before_670} 
        onChange={handleChange} 
        path="before_670" 
      />
      
      <CoefficientFormSection 
        title="От 670 кВт·ч до 10 МВт·ч" 
        data={coefficients.from_670_to_10} 
        onChange={handleChange} 
        path="from_670_to_10" 
      />
      
      <CoefficientFormSection 
        title="От 10 МВт·ч" 
        data={coefficients.from_10} 
        onChange={handleChange} 
        path="from_10" 
      />
      
      <button 
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Сохранение...
          </>
        ) : 'Сохранить изменения'}
      </button>
    </div>
  );
};

export default SecondCategoryTab;