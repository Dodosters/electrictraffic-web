import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './BusinessCalculator.css';

const BusinessCalculator = ({ tariffs }) => {
  const [region, setRegion] = useState('');
  const [consumption, setConsumption] = useState('');
  const [powerTariff, setPowerTariff] = useState('VN');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // New states for Excel file and processed data
  const [file, setFile] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);

  // Handle file change for Excel upload
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setProcessedData(null);
      await processExcelFile(selectedFile);
    }
  };

  // Process Excel file through API
  const processExcelFile = async (file) => {
    setFileLoading(true);
    
    try {
      console.log('Загруженный файл:', file.name);
      console.log('Размер файла:', file.size, 'байт');
      
      // Use chart-data API to get the hourly data (this is more robust)
      const chartDataResponse = await api.getChartData(file, 'hourly');
      
      if (!chartDataResponse || !chartDataResponse.series || chartDataResponse.series.length === 0) {
        throw new Error('Не удалось извлечь данные из файла');
      }
      
      // Create processed data format similar to the /process-excel endpoint
      const excelData = {};
      let totalConsumption = 0;
      let dayConsumption = 0;
      let nightConsumption = 0;
      
      // Process each day from chart data
      chartDataResponse.series.forEach(daySeries => {
        const dateStr = daySeries.date;
        const hourlyValues = [];
        
        // Extract hourly values
        daySeries.points.forEach(point => {
          const hourValue = point.value;
          hourlyValues[point.hour] = hourValue;
          
          // Calculate totals
          totalConsumption += hourValue;
          
          // Day consumption (6 PM - 9 PM) - hours 18, 19, 20
          if (point.hour >= 18 && point.hour <= 20) {
            dayConsumption += hourValue;
          }
          
          // Night consumption (9 PM - 6 AM) - hours 21-23 and 0-5
          if (point.hour >= 21 || point.hour <= 5) {
            nightConsumption += hourValue;
          }
        });
        
        excelData[dateStr] = hourlyValues;
      });
      
      // Set processed data for later use
      setProcessedData(excelData);
      
      // Set the consumption value
      setConsumption(totalConsumption.toFixed(2));
      
      setFileLoading(false);
    } catch (err) {
      console.error('Ошибка обработки файла:', err);
      setError(`Ошибка обработки файла: ${err.message}`);
      setFileLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!region || !consumption) {
      setError('Пожалуйста, заполните все необходимые поля');
      return;
    }
    
    if (isNaN(consumption) || parseFloat(consumption) <= 0) {
      setError('Введите корректное значение потребления');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // Базовые параметры для расчета
      const totalConsumption = parseFloat(consumption);
      
      // Параметры для дневного и ночного потребления
      let dayConsumption = 0;
      let nightConsumption = 0;
      
      // Массив дневного потребления
      let realVolume = [];
      
      if (processedData) {
        // Если есть обработанные данные из Excel, используем их
        for (const dateStr in processedData) {
          if (Object.prototype.hasOwnProperty.call(processedData, dateStr)) {
            const hourlyValues = processedData[dateStr];
            let dailySum = 0;
            
            // Суммируем почасовые значения для получения дневной суммы
            for (let i = 0; i < hourlyValues.length; i++) {
              const hourValue = hourlyValues[i] || 0;
              dailySum += hourValue;
              
              // Дневное потребление (с 18 до 21 часа)
              if (i >= 18 && i <= 20) {
                dayConsumption += hourValue;
              }
              
              // Ночное потребление (с 21 до 6 утра)
              if (i >= 21 || i <= 5) {
                nightConsumption += hourValue;
              }
            }
            
            // Добавляем дневную сумму в массив реального объема
            if (dailySum > 0) {
              realVolume.push(dailySum);
            }
          }
        }
      } else {
        // Если нет обработанных данных, используем моковые значения
        dayConsumption = totalConsumption * 0.15; // 15% от общего как мок
        nightConsumption = totalConsumption * 0.35; // 35% от общего как мок
        
        // Моковый массив дневного потребления (просто разделим общее потребление на 30 дней)
        for (let i = 0; i < 30; i++) {
          realVolume.push(totalConsumption / 30);
        }
      }
      
      // Моковые значения для оставшихся параметров
      const costOfEnergy = 2.5; // Фиксированное значение в рублях
      const realAveragePower = totalConsumption / 720; // Средняя мощность (общее потребление / часов в месяце)
      const realAveragePowerBroadcast = realAveragePower * 0.9; // 90% от средней мощности
      
      // Отправляем запрос на API с нужными параметрами
      const requestParams = {
        region,
        consumption: totalConsumption,
        power_tarif: powerTariff,
        day_consumption: dayConsumption,
        night_consumption: nightConsumption,
        cost_of_energy: costOfEnergy,
        real_volume: realVolume,
        real_average_power: realAveragePower,
        real_average_power_broadcast: realAveragePowerBroadcast
      };
      
      console.log('Отправляем запрос с параметрами:', requestParams);
      
      const response = await api.calculateBusinessElectricityCost(requestParams);
      
      if (response.success) {
        console.log('Получен ответ:', response.data);
        setResult(response.data);
      } else {
        throw new Error(response.error || 'Ошибка при расчете');
      }
    } catch (err) {
      console.error('Ошибка при расчете:', err);
      setError('Не удалось выполнить расчет. Подробности: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Функция для форматирования чисел в виде валюты
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
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
                  onChange={(e) => setRegion(e.target.value)}
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
                <label htmlFor="powerTariff" className="form-label">Тарифная мощность</label>
                <select 
                  id="powerTariff"
                  className="form-select"
                  value={powerTariff}
                  onChange={(e) => setPowerTariff(e.target.value)}
                  required
                >
                  <option value="VN">VN - Высокое напряжение</option>
                  <option value="SN1">SN1 - Среднее напряжение 1</option>
                  <option value="SN2">SN2 - Среднее напряжение 2</option>
                  <option value="NN">NN - Низкое напряжение</option>
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
                <label htmlFor="excel-file" className="form-label">Загрузить файл почасового потребления</label>
                <input
                  type="file"
                  className="form-control"
                  id="excel-file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={fileLoading}
                />
                <div className="form-text">
                  Загрузите Excel-файл с почасовыми данными потребления для более точного расчета
                </div>
              </div>
            </div>
            
            {fileLoading && (
              <div className="text-center my-3">
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                <span>Обработка файла...</span>
              </div>
            )}
            
            <div className="d-grid mt-4">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading || fileLoading}
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
            <div className="mt-4 p-3 rounded results-container">
              <h4 className="mb-3">Результаты расчета:</h4>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <p><strong>Город:</strong> {result.region}</p>
                  <p><strong>Потребление:</strong> {result.consumption} кВтч</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Тарифная мощность:</strong> {powerTariff}</p>
                  <p><strong>Валюта:</strong> {result.currency}</p>
                </div>
              </div>
              
              <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover">
                  <thead className="table-primary">
                    <tr>
                      <th>Категория</th>
                      <th>Описание</th>
                      <th>Стоимость</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Категория 1</td>
                      <td>Одноставочный тариф</td>
                      <td className="text-end fw-bold">{formatCurrency(result.cost1)}</td>
                    </tr>
                    <tr>
                      <td>Категория 2</td>
                      <td>Двухставочный тариф (день/ночь)</td>
                      <td className="text-end fw-bold">{formatCurrency(result.cost2)}</td>
                    </tr>
                    <tr>
                      <td>Категория 3</td>
                      <td>Трехставочный тариф</td>
                      <td className="text-end fw-bold">{formatCurrency(result.cost3)}</td>
                    </tr>
                    <tr>
                      <td>Категория 4</td>
                      <td>Четырехставочный тариф</td>
                      <td className="text-end fw-bold">{formatCurrency(result.cost4)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-3 p-3 bg-light rounded">
                <h5 className="mb-2">Рекомендации:</h5>
                <p>
                  {getRecommendation(result)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Вспомогательная функция для определения оптимального тарифа
function getRecommendation(result) {
  const costs = [
    { category: 'Категория 1', value: result.cost1 },
    { category: 'Категория 2', value: result.cost2 },
    { category: 'Категория 3', value: result.cost3 },
    { category: 'Категория 4', value: result.cost4 }
  ];
  
  // Находим минимальную стоимость
  const minCost = costs.reduce((min, current) => 
    current.value < min.value ? current : min, costs[0]);
  
  return `Оптимальным для вас является ${minCost.category} со стоимостью ${minCost.value} ${result.currency}. 
    Это позволит вам сэкономить по сравнению с другими вариантами.`;
}

export default BusinessCalculator;