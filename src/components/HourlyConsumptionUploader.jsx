import { useState } from 'react';
import { api } from '../services/api';
import './HourlyConsumptionUploader.css';
import HourlyConsumptionPreview from './HourlyConsumptionPreview';

const HourlyConsumptionUploader = ({ onDataLoaded }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Обработка выбора файла
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setParsedData(null);
      processExcelFile(selectedFile);
    }
  };

  // Обработка Excel-файла через API
  const processExcelFile = async (file) => {
    setLoading(true);
    
    try {
      console.log('Загруженный файл:', file.name);
      console.log('Размер файла:', file.size, 'байт');
      
      // Отправляем файл на сервер для обработки
      const response = await api.processExcelFile(file);
      
      if (!response) {
        throw new Error('Не получен ответ от сервера');
      }
      
      // Преобразуем полученные данные в формат, ожидаемый компонентом предпросмотра
      const formattedData = formatExcelDataForPreview(response);
      
      if (formattedData.days.length === 0) {
        throw new Error('Не удалось найти данные о потреблении в указанном файле');
      }
      
      setParsedData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка обработки файла:', err);
      setError(`Ошибка обработки файла: ${err.message}`);
      setLoading(false);
    }
  };
  
  // Форматирование данных, полученных от API, для компонента предпросмотра
  const formatExcelDataForPreview = (responseData) => {
    const result = {
      days: [],
      hoursData: {}
    };
    
    // Обрабатываем полученные данные
    try {
      // Получаем все даты из ответа API
      for (const dateStr in responseData) {
        if (Object.prototype.hasOwnProperty.call(responseData, dateStr)) {
          result.days.push(dateStr);
          result.hoursData[dateStr] = {};
          
          // Получаем почасовые данные (массив из 24 значений)
          const hourlyValues = responseData[dateStr];
          
          // Преобразуем в формат {час: значение}
          for (let i = 0; i < hourlyValues.length; i++) {
            const hour = i + 1; // Часы от 1 до 24
            result.hoursData[dateStr][hour] = hourlyValues[i];
          }
        }
      }
      
      // Сортируем дни
      result.days.sort();
      
      console.log(`Обработано ${result.days.length} дней с данными потребления`);
      if (result.days.length > 0) {
        const sampleDay = result.days[0];
        console.log(`Пример данных для дня ${sampleDay}:`, result.hoursData[sampleDay]);
      }
    } catch (err) {
      console.error('Ошибка форматирования данных:', err);
    }
    
    return result;
  };

  // Обработка нажатия кнопки "Рассчитать"
  const handleCalculate = async () => {
    if (!file) {
      setError('Ошибка: не выбран файл для расчета');
      return;
    }
    
    setCalculating(true);
    setError(null);
    
    try {
      // Напрямую отправляем файл на обработку (не конвертируя в CSV)
      // Используем chart-data API для получения почасовых данных
      const chartDataResponse = await api.getChartData(file, 'hourly');
      
      if (!chartDataResponse || !chartDataResponse.series || chartDataResponse.series.length === 0) {
        throw new Error('Не удалось получить данные из файла');
      }
      
      // Формируем данные в нужном формате для HourlyConsumptionPage
      const processedData = {
        hourlyData: chartDataResponse.series.map(daySeries => {
          const date = daySeries.date;
          const hours = {};
          
          // Формируем часовые данные
          daySeries.points.forEach(point => {
            const hour = point.hour + 1; // Преобразуем 0-23 в 1-24
            hours[hour] = {
              consumption: point.value,
              rate: 5.5, // Базовая ставка (можно изменить)
              zone: getZoneByHour(hour),
              cost: point.value * 5.5
            };
          });
          
          // Рассчитываем итоговую стоимость за день
          const dailyTotal = Object.values(hours).reduce((sum, h) => sum + h.cost, 0);
          
          return {
            date: date,
            hours: hours,
            hoursCost: hours,
            dailyTotal: dailyTotal
          };
        }),
        hourlyRates: generateHourlyRates(),
        zoneTariffs: {
          peak: 7.2,
          semiPeak: 5.5,
          night: 3.8
        }
      };
      
      // Передаем обработанные данные вызывающему компоненту
      onDataLoaded(processedData);
      
      setCalculating(false);
    } catch (err) {
      console.error('Ошибка при расчете:', err);
      setError(`${err.message} 
        
Проверьте, что файл соответствует одному из поддерживаемых форматов.
Если ошибка повторяется, попробуйте использовать другой файл или обратитесь в поддержку.`.trim());
      setCalculating(false);
    }
  };
  
  // Вспомогательная функция для определения зоны по часу
  const getZoneByHour = (hour) => {
    // Пиковые часы (8-11 и 16-21)
    if ((hour >= 8 && hour <= 11) || (hour >= 16 && hour <= 21)) {
      return 'Пик';
    }
    // Ночные часы (23-7)
    else if (hour >= 23 || (hour >= 1 && hour <= 7)) {
      return 'Ночь';
    }
    // Полупиковые часы (все остальные)
    else {
      return 'Полупик';
    }
  };
  
  // Генерация почасовых ставок для всех часов
  const generateHourlyRates = () => {
    const rates = {};
    
    for (let hour = 1; hour <= 24; hour++) {
      const zone = getZoneByHour(hour);
      let rate = 5.5; // Базовая ставка (полупик)
      
      if (zone === 'Пик') {
        rate = 7.2;
      } else if (zone === 'Ночь') {
        rate = 3.8;
      }
      
      rates[hour] = {
        rate: rate,
        zone: zone
      };
    }
    
    return rates;
  };

  return (
    <div className="hourly-uploader">
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Загрузка файла почасового потребления</h3>
        </div>
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <div className="mb-3">
            <label htmlFor="excel-file" className="form-label">Выберите Excel-файл с почасовыми данными потребления</label>
            <input 
              type="file" 
              className="form-control" 
              id="excel-file" 
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={loading || calculating}
            />
            <div className="form-text">
              Файл должен содержать данные о потреблении электроэнергии по часам за каждый день.
              <br />
              Поддерживаемые форматы:
              <ul className="mt-2">
                <li>Excel файлы (.xlsx, .xls)</li>
                <li>Формат: Таблица с датой, часом и значением потребления</li>
                <li>Файл может содержать дополнительные данные, которые будут проигнорированы</li>
              </ul>
              <div className="alert alert-info mt-2">
                <strong>Подсказка:</strong> Для файла "Подтверждение_почасового_расчета" система автоматически определяет формат.
              </div>
              <div className="alert alert-info mt-2">
                <strong>Примечание:</strong> Система работает только с данными для региона "Ростов-на-Дону".
              </div>
            </div>
          </div>
          
          {loading && (
            <div className="text-center my-4">
              <span className="spinner-border text-primary" role="status" aria-hidden="true"></span>
              <p className="mt-2">Загрузка и анализ файла...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Предварительный просмотр данных */}
      {parsedData && !loading && (
        <HourlyConsumptionPreview 
          data={parsedData} 
          onCalculate={handleCalculate} 
        />
      )}
      
      {/* Индикатор выполнения расчета */}
      {calculating && (
        <div className="card">
          <div className="card-body">
            <div className="text-center my-4">
              <span className="spinner-border text-primary" role="status" aria-hidden="true"></span>
              <p className="mt-2">Выполняется расчет стоимости...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HourlyConsumptionUploader;