import { useState } from 'react';
import { api } from '../services/api';
import './BusinessCalculator.css';

const BusinessCalculator = ({ tariffs }) => {
  const [region, setRegion] = useState('');
  const [tariffType, setTariffType] = useState('');
  const [consumption, setConsumption] = useState('');
  const [period, setPeriod] = useState('month');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get available tariff types for selected region
  const getTariffTypes = () => {
    if (!region) return [];
    const regionTariff = tariffs.find(t => t.region === region);
    return regionTariff ? regionTariff.tariffTypes : [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!region || !tariffType || !consumption) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    if (isNaN(consumption) || parseFloat(consumption) <= 0) {
      setError('Введите корректное значение потребления');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const response = await api.calculateBusinessElectricityCost({
        region,
        tariffType,
        consumption: parseFloat(consumption),
        period
      });
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'Ошибка при расчете');
      }
    } catch (err) {
      console.error('Error calculating cost:', err);
      setError('Не удалось выполнить расчет. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="calculator-container">
      <div className="card calculator-card">
        <div className="card-header calculator-header">
          <h3 className="card-title">Расчет стоимости электроэнергии</h3>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="region" className="form-label">Город</label>
                <select 
                  id="region"
                  className="form-select"
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setTariffType('');
                  }}
                  required
                >
                  <option value="">Выберите город</option>
                  {tariffs.map(tariff => (
                    <option key={tariff.id} value={tariff.region}>
                      {tariff.region}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="tariffType" className="form-label">Тип тарифа</label>
                <select 
                  id="tariffType"
                  className="form-select"
                  value={tariffType}
                  onChange={(e) => setTariffType(e.target.value)}
                  disabled={!region}
                  required
                >
                  <option value="">Выберите тип тарифа</option>
                  {getTariffTypes().map(type => (
                    <option key={type.id} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="consumption" className="form-label">Объем потребления (кВтч)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  id="consumption"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="col-md-6">
                <label htmlFor="period" className="form-label">Период</label>
                <select 
                  id="period"
                  className="form-select"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="month">Месяц</option>
                  <option value="quarter">Квартал</option>
                  <option value="year">Год</option>
                </select>
              </div>
            </div>
            
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Расчет...
                  </>
                ) : 'Рассчитать'}
              </button>
            </div>
          </form>
          
          {result && (
            <div className="mt-4 p-3 bg-light rounded">
              <h4 className="mb-3">Результат расчета:</h4>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Город:</strong> {result.region}</p>
                  <p><strong>Тип тарифа:</strong> {result.tariffType}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Объем потребления:</strong> {result.consumption} кВтч</p>
                  <p><strong>Период:</strong> {result.period === 'month' ? 'Месяц' : result.period === 'quarter' ? 'Квартал' : 'Год'}</p>
                </div>
              </div>
              <div className="result-cost">
                <span>Стоимость:</span>
                <span className="cost-value">{result.cost} {result.currency}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessCalculator;
