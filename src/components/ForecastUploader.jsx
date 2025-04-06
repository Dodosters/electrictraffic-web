import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ForecastUploader = ({ onForecastComplete }) => {
  const [file, setFile] = useState(null);
  const [monthsAhead, setMonthsAhead] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [formattedChartData, setFormattedChartData] = useState([]);
  const [showForecastResults, setShowForecastResults] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Эффект для преобразования данных прогноза в формат для графика
  useEffect(() => {
    if (!forecastData || !forecastData.forecast) {
      console.log("No forecast data available");
      setFormattedChartData([]);
      return;
    }

    // Вывод структуры ответа для отладки
    console.log("Raw forecast data:", forecastData);
    
    try {
      // Преобразуем данные в формат для графика
      const chartData = forecastData.forecast
        .filter(item => item && typeof item === 'object')
        .map(item => {
          // Для каждого элемента проверяем наличие необходимых полей
          // API использует поле "volume" вместо "prediction"
          const formattedItem = {
            date: item.year && item.month ? `${item.year}-${item.month}` : item.date || `Период ${Math.random().toString(36).substring(7)}`,
            value: typeof item.volume === 'number' ? item.volume : 
                  typeof item.prediction === 'number' ? item.prediction : null,
          };

          // Добавляем фактические значения, если они есть
          if (typeof item.actual === 'number') {
            formattedItem.actual = item.actual;
          }

          return formattedItem;
        });
      
      console.log("Formatted chart data:", chartData);
      setFormattedChartData(chartData);
    } catch (err) {
      console.error("Error formatting forecast data:", err);
      setError("Ошибка при обработке данных прогноза: " + err.message);
      setFormattedChartData([]);
    }
  }, [forecastData]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && !selectedFile.name.endsWith('.csv')) {
      setError('Пожалуйста, загрузите файл в формате CSV');
      setFile(null);
    } else {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleMonthsChange = (event) => {
    const value = parseInt(event.target.value);
    if (value < 1) {
      setMonthsAhead(1);
    } else if (value > 24) {
      setMonthsAhead(24);
    } else {
      setMonthsAhead(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!file) {
      setError('Пожалуйста, выберите файл');
      return;
    }

    setLoading(true);
    setError(null);
    setFormattedChartData([]);
    setApiResponse(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const API_BASE_URL = 'http://localhost:8000';
      console.log("Sending request to:", `${API_BASE_URL}/forecast/?months_ahead=${monthsAhead}`);
      
      const response = await fetch(`${API_BASE_URL}/forecast/?months_ahead=${monthsAhead}`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        let errorMessage = "Ошибка при выполнении прогноза";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          // Игнорируем ошибку парсинга JSON
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("API Response data:", data);
      setApiResponse(data);
      
      // Проверяем, есть ли в ответе данные прогноза
      if (!data) {
        throw new Error('Получен пустой ответ от API');
      }
      
      if (!data.forecast || !Array.isArray(data.forecast)) {
        console.warn('Некорректный формат данных от API: прогноз отсутствует или не является массивом');
        // Создаем заглушку для прогноза, если его нет
        data.forecast = [];
      }
      
      setForecastData(data);
      setShowForecastResults(true);
      
      // If callback provided, call it with the forecast data
      if (onForecastComplete) {
        // Форматируем данные для обратного вызова
        const formattedData = {
          ...data,
          forecast: data.forecast.map(item => ({
            ...item,
            prediction: item.volume !== undefined ? item.volume : item.prediction
          }))
        };
        onForecastComplete(formattedData);
      }
    } catch (err) {
      console.error('Error during forecast:', err);
      setError(err.message || 'Произошла ошибка при обработке прогноза');
    } finally {
      setLoading(false);
    }
  };

  const renderForecastChart = () => {
    if (formattedChartData.length === 0) {
      return (
        <div className="alert alert-warning">
          <h5>Нет данных для построения графика</h5>
          <p>Формат данных, полученных от API:</p>
          <pre style={{ maxHeight: '200px', overflow: 'auto' }}>
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      );
    }
    
    // Определяем, есть ли фактические данные для отображения
    const hasActualData = formattedChartData.some(item => item.actual !== undefined);
    
    return (
      <div style={{ height: '400px', marginTop: '1.5rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              label={{ value: 'Период', position: 'insideBottomRight', offset: -10 }} 
            />
            <YAxis 
              label={{ value: 'Объем потребления', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip 
              formatter={(value) => value !== null ? value.toFixed(2) : 'Нет данных'} 
            />
            <Legend />
            {hasActualData && (
              <Line
                key="actual-line"
                type="monotone"
                dataKey="actual"
                name="Фактические данные"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                isAnimationActive={false}
                connectNulls={true}
              />
            )}
            <Line
              key="forecast-line"
              type="monotone"
              dataKey="value"
              name="Прогноз"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
              strokeDasharray="5 5"
              isAnimationActive={false}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderForecastSummary = () => {
    if (!forecastData || !forecastData.forecast || !forecastData.forecast.length) {
      return (
        <div className="alert alert-info">
          Нет данных для отображения статистики прогноза.
        </div>
      );
    }
    
    // Фильтруем только валидные прогнозные значения - используем volume или prediction
    const predictions = forecastData.forecast
      .map(item => item.volume !== undefined ? item.volume : item.prediction)
      .filter(val => val !== undefined && val !== null && !isNaN(val));
    
    if (!predictions.length) {
      return (
        <div className="alert alert-info">
          Нет числовых данных для статистического анализа.
        </div>
      );
    }
    
    const average = predictions.reduce((sum, val) => sum + val, 0) / predictions.length;
    const max = Math.max(...predictions);
    const min = Math.min(...predictions);
    
    return (
      <div className="mt-4">
        <h4>Результаты прогноза:</h4>
        <div className="row mt-3">
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Среднее значение</h5>
                <p className="card-text fs-4">{average.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Максимум</h5>
                <p className="card-text fs-4">{max.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Минимум</h5>
                <p className="card-text fs-4">{min.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="table-responsive mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Год</th>
                <th>Месяц</th>
                <th>Прогноз потребления</th>
                {forecastData.forecast.some(item => item.actual !== undefined) && 
                  <th>Фактическое потребление</th>
                }
              </tr>
            </thead>
            <tbody>
              {forecastData.forecast.map((item, index) => (
                <tr key={index}>
                  <td>{item.year !== undefined ? item.year : '-'}</td>
                  <td>{item.month !== undefined ? item.month : '-'}</td>
                  <td>
                    {(item.volume !== undefined && item.volume !== null) 
                      ? Number(item.volume).toFixed(2) 
                      : (item.prediction !== undefined && item.prediction !== null)
                        ? Number(item.prediction).toFixed(2)
                        : '-'}
                  </td>
                  {forecastData.forecast.some(item => item.actual !== undefined) && 
                    <td>
                      {item.actual !== undefined && item.actual !== null 
                        ? Number(item.actual).toFixed(2) 
                        : '-'}
                    </td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDownloadLink = () => {
    if (!forecastData || !forecastData.forecast || !forecastData.forecast.length) return null;
    
    try {
      const csvContent = 
        "year,month,forecast\n" + 
        forecastData.forecast
          .filter(item => 
            item && 
            item.year !== undefined && 
            item.month !== undefined && 
            (item.volume !== undefined || item.prediction !== undefined)
          )
          .map(item => {
            const forecastValue = item.volume !== undefined ? item.volume : item.prediction;
            return `${item.year},${item.month},${forecastValue}`;
          })
          .join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      return (
        <a 
          href={url} 
          download="forecast_results.csv"
          className="btn btn-outline-primary mt-3"
        >
          <i className="bi bi-download me-2"></i>
          Скачать результаты в CSV
        </a>
      );
    } catch (err) {
      console.error("Error creating download link:", err);
      return (
        <div className="alert alert-danger mt-3">
          Ошибка при создании файла для скачивания: {err.message}
        </div>
      );
    }
  };

  const renderSampleLink = () => {
    // Sample CSV data structure
    const sampleCsvContent = 
      "year,month,volume\n" +
      "2022,1,1240\n" +
      "2022,2,1180\n" +
      "2022,3,1320\n" +
      "2022,4,1090\n" +
      "2022,5,980\n" +
      "2022,6,1150\n" +
      "2022,7,1340\n" +
      "2022,8,1270\n" +
      "2022,9,1180\n" +
      "2022,10,1050\n" +
      "2022,11,1120\n" +
      "2022,12,1310\n" +
      "2023,1,1290\n" +
      "2023,2,1210\n" +
      "2023,3,1350\n";
    
    const blob = new Blob([sampleCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    return (
      <a 
        href={url} 
        download="sample_consumption_data.csv"
        className="btn btn-link"
      >
        Скачать пример CSV файла
      </a>
    );
  };

  return (
    <div className="forecast-uploader">
      <div className="card">
        <div className="card-header">
          <h3 className="mb-0">Прогнозирование потребления электроэнергии</h3>
        </div>
        <div className="card-body">
          {!showForecastResults ? (
            <>
              <p className="card-text">
                Загрузите файл с историческими данными о потреблении электроэнергии, 
                и мы построим прогноз на выбранное количество месяцев вперед.
              </p>
              
              <div className="alert alert-info">
                <strong>Требования к файлу:</strong>
                <ul className="mb-0 mt-2">
                  <li>Формат CSV</li>
                  <li>Обязательные колонки: year, month, volume</li>
                  <li>Минимум 3 записи для построения прогноза</li>
                  <li>Данные должны быть ежемесячными</li>
                </ul>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fileUpload" className="form-label">Выберите файл CSV</label>
                  <input
                    type="file"
                    className="form-control"
                    id="fileUpload"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                  {renderSampleLink()}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="monthsAhead" className="form-label">
                    Количество месяцев для прогноза (1-24)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="monthsAhead"
                    min="1"
                    max="24"
                    value={monthsAhead}
                    onChange={handleMonthsChange}
                  />
                </div>
                
                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading || !file}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Обработка...
                    </>
                  ) : 'Сделать прогноз'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Результаты прогнозирования</h4>
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowForecastResults(false)}
                >
                  Новый прогноз
                </button>
              </div>
              
              {error && (
                <div className="alert alert-danger mb-4">
                  {error}
                </div>
              )}
              
              {renderForecastChart()}
              {renderForecastSummary()}
              {renderDownloadLink()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForecastUploader;