import { useState } from 'react';
import { api } from '../services/api';
import './HourlyConsumptionUploader.css';
import { parseHourlyConsumptionData, convertToApiFormat } from '../utils/csvParser';
import HourlyConsumptionPreview from './HourlyConsumptionPreview';

const HourlyConsumptionUploader = ({ onDataLoaded }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [csvText, setCsvText] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [calculating, setCalculating] = useState(false);

  // Обработка выбора файла
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setParsedData(null);
      setCsvText(null);
      readFile(selectedFile);
    }
  };

  // Чтение файла и предварительный анализ
  const readFile = async (file) => {
    setLoading(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          setCsvText(text);
          
          // Добавляем логирование формата файла
          console.log('Загруженный файл:', file.name);
          console.log('Размер файла:', file.size, 'байт');
          console.log('Первые 200 символов файла:', text.substring(0, 200));
          
          // Анализируем CSV и создаем предварительную таблицу
          const data = parseHourlyConsumptionData(text);
          
          if (data.days.length === 0) {
            throw new Error('Не удалось найти данные о потреблении в указанном файле');
          }
          
          setParsedData(data);
          setLoading(false);
        } catch (err) {
          console.error('Ошибка обработки файла:', err);
          setError(`Ошибка обработки файла: ${err.message}`);
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Ошибка чтения файла. Возможно, файл поврежден или имеет неподдерживаемый формат.');
        setLoading(false);
      };
      
      reader.readAsText(file);
    } catch (err) {
      console.error('Ошибка загрузки файла:', err);
      setError('Ошибка загрузки файла: ' + err.message);
      setLoading(false);
    }
  };

  // Обработка нажатия кнопки "Рассчитать"
  const handleCalculate = async () => {
    if (!csvText || !parsedData) {
      setError('Ошибка: нет данных для расчета');
      return;
    }
    
    setCalculating(true);
    setError(null);
    
    try {
      // Преобразуем данные для отправки в API
      const formattedCsv = convertToApiFormat(parsedData);
      
      // Отправляем данные на обработку через API
      const response = await api.processHourlyConsumption(formattedCsv, 'Ростов-на-Дону');
      
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
Если ошибка повторяется, попробуйте открыть CSV-файл в текстовом редакторе и проверить его содержимое.
Также можно попробовать экспортировать данные в другом формате или использовать разделитель ";"`.trim());
      setCalculating(false);
    }
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
              id="csv-file" 
              accept=".csv" 
              onChange={handleFileChange}
              disabled={loading || calculating}
            />
            <div className="form-text">
              Файл должен содержать данные о потреблении электроэнергии по часам за каждый день.
              <br />
              Поддерживаемые форматы:
              <ul className="mt-2">
                <li>CSV с разделителями ";" или ","</li>
                <li>Формат 1: Строки с датой в столбце 1, часом в столбце 3 и потреблением в столбце 10</li>
                <li>Формат 2: Каждая строка соответствует дню, столбцы содержат потребление по часам</li>
                <li>Формат 3: Каждая строка содержит дату, час и значение потребления</li>
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