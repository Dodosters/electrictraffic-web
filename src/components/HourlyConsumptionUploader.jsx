import { useState } from 'react';
import { api } from '../services/api';
import './HourlyConsumptionUploader.css';

const HourlyConsumptionUploader = ({ onDataLoaded }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Пожалуйста, выберите файл');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const text = e.target.result;
          
          // Добавляем логирование формата файла
          console.log('Загруженный файл:', file.name);
          console.log('Размер файла:', file.size, 'байт');
          console.log('Первые 200 символов файла:', text.substring(0, 200));
          
          // Отправляем CSV на обработку через API
          const response = await api.processHourlyConsumption(text, 'Москва');
          
          if (!response.success) {
            throw new Error(response.error || 'Ошибка обработки данных');
          }
          
          // Передаем обработанные данные вызывающему компоненту
          onDataLoaded(response.data);
          
          setLoading(false);
        } catch (err) {
          console.error('Ошибка обработки файла:', err);
          setError(`${err.message} 
            
Проверьте, что файл соответствует одному из поддерживаемых форматов.
Если ошибка повторяется, попробуйте открыть CSV-файл в текстовом редакторе и проверить его содержимое.
Также можно попробовать экспортировать данные в другом формате или использовать разделитель ";"`.trim());
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

  return (
    <div className="hourly-uploader">
      <div className="card">
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
              disabled={loading}
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
            </div>
          </div>
          
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Обработка...
              </>
            ) : 'Загрузить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HourlyConsumptionUploader;
