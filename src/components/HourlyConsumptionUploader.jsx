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
    if (!parsedData || !file) {
      setError('Ошибка: нет данных для расчета');
      return;
    }
    
    setCalculating(true);
    setError(null);
    
    try {
      // Создаем CSV-строку на основе обработанных данных для отправки в API
      const csvData = convertParsedDataToCsv(parsedData);
      
      // Отправляем данные на обработку через API
      const response = await api.processHourlyConsumption(csvData, 'Ростов-на-Дону');
      
      if (!response.success) {
        throw new Error(response.error || 'Ошибка обработки данных');
      }
      
      // Передаем обработанные данные вызывающему компоненту
      onDataLoaded(response.data);
      
      setCalculating(false);
    } catch (err) {
      console.error('Ошибка при расчете:', err);
      setError(`${err.message} 
        
Проверьте, что файл соответствует одному из поддерживаемых форматов.
Если ошибка повторяется, попробуйте использовать другой файл или обратитесь в поддержку.`.trim());
      setCalculating(false);
    }
  };
  
  // Преобразование данных предпросмотра в CSV для API расчета
  const convertParsedDataToCsv = (parsedData) => {
    if (!parsedData || !parsedData.days || parsedData.days.length === 0) {
      return '';
    }
    
    // Создаем строки CSV
    const csvRows = [];
    
    // Заголовок 
    csvRows.push('Дата;Час;Потребление');
    
    // Данные
    for (const day of parsedData.days) {
      for (let hour = 1; hour <= 24; hour++) {
        const consumption = parsedData.hoursData[day][hour];
        if (consumption > 0) {
          // Заменяем точку на запятую для русскоязычного формата CSV
          csvRows.push(`${day};${hour};${consumption.toString().replace('.', ',')}`);
        }
      }
    }
    
    return csvRows.join('\n');
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
            <label htmlFor="csv-file" className="form-label">Выберите CSV файл с почасовыми данными потребления</label>
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