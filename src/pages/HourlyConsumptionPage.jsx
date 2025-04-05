import { useState } from 'react';
import HourlyConsumptionUploader from '../components/HourlyConsumptionUploader';
import HourlyConsumptionTable from '../components/HourlyConsumptionTable';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import './HourlyConsumptionPage.css';

const HourlyConsumptionPage = () => {
  const [consumptionData, setConsumptionData] = useState(null);
  const [chartType, setChartType] = useState('line'); // 'line' или 'bar'

  // Обработчик получения данных от API после расчета
  const handleDataLoaded = (data) => {
    setConsumptionData(data);
    
    // Прокрутка к результатам
    setTimeout(() => {
      const resultsSection = document.getElementById('results-section');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Подготовка данных для графика, если данные загружены
  const prepareChartData = () => {
    if (!consumptionData || !consumptionData.hourlyData || consumptionData.hourlyData.length === 0) {
      return [];
    }

    // Используем первый день для графика
    const firstDay = consumptionData.hourlyData[0];
    
    const chartData = [];
    
    for (let hour = 1; hour <= 24; hour++) {
      const hourData = firstDay.hoursCost[hour] || {
        consumption: 0,
        rate: 0,
        zone: '',
        cost: 0
      };
      
      chartData.push({
        hour: `${hour}:00`,
        consumption: hourData.consumption,
        cost: hourData.cost,
        zone: hourData.zone
      });
    }
    
    return chartData;
  };

  const chartData = prepareChartData();

  // Форматирование суммы для подсказки на графике
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Настройка цветов для графика
  const getZoneColor = (zone) => {
    switch (zone) {
      case 'Пик':
        return 'rgba(255, 99, 132, 0.7)';
      case 'Полупик':
        return 'rgba(255, 159, 64, 0.7)';
      case 'Ночь':
        return 'rgba(54, 162, 235, 0.7)';
      default:
        return 'rgba(128, 128, 128, 0.7)';
    }
  };

  return (
    <div className="hourly-consumption-page">
      <div className="container mt-5 pt-5">
        <h1 className="h-primary text-center">Почасовое потребление электроэнергии</h1>
        <div className="section-divider socket"></div>
        
        <p className="text-center mb-5">
          Загрузите файл с почасовыми данными потребления электроэнергии для анализа и расчета стоимости
          по различным тарифным зонам.
        </p>
        
        <HourlyConsumptionUploader onDataLoaded={handleDataLoaded} />
        
        {consumptionData && (
          <div id="results-section">
            <h2 className="mt-5 mb-4 text-center">Результаты расчета</h2>
            <HourlyConsumptionTable data={consumptionData} />
            
            <div className="chart-container">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="card-title">График потребления и стоимости</h3>
                    <div className="chart-type-selector">
                      <div className="btn-group" role="group">
                        <button 
                          type="button" 
                          className={`btn ${chartType === 'line' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setChartType('line')}
                        >
                          Линейный
                        </button>
                        <button 
                          type="button" 
                          className={`btn ${chartType === 'bar' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setChartType('bar')}
                        >
                          Столбчатый
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                      {chartType === 'line' ? (
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis yAxisId="left" orientation="left" label={{ value: 'Потребление (кВтч)', angle: -90, position: 'insideLeft' }} />
                          <YAxis yAxisId="right" orientation="right" label={{ value: 'Стоимость (руб)', angle: 90, position: 'insideRight' }} />
                          <Tooltip formatter={(value, name) => {
                            if (name === 'cost') return formatCurrency(value);
                            return value.toFixed(3);
                          }} />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="consumption" 
                            name="Потребление (кВтч)" 
                            stroke="#3f51b5" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="cost" 
                            name="Стоимость (руб)" 
                            stroke="#f44336" 
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis yAxisId="left" orientation="left" label={{ value: 'Потребление (кВтч)', angle: -90, position: 'insideLeft' }} />
                          <YAxis yAxisId="right" orientation="right" label={{ value: 'Стоимость (руб)', angle: 90, position: 'insideRight' }} />
                          <Tooltip formatter={(value, name) => {
                            if (name === 'cost') return formatCurrency(value);
                            return value.toFixed(3);
                          }} />
                          <Legend />
                          <Bar 
                            yAxisId="left"
                            dataKey="consumption" 
                            name="Потребление (кВтч)" 
                            fill="#3f51b5"
                          />
                          <Bar 
                            yAxisId="right"
                            dataKey="cost" 
                            name="Стоимость (руб)" 
                            fill="#f44336" 
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5">
              <h2 className="h4 mb-4">Информация о потреблении</h2>
              <p>
                Почасовое распределение потребления электроэнергии позволяет более точно рассчитать стоимость
                электроэнергии с учетом тарифных зон. Такой подход актуален для предприятий, работающих круглосуточно
                или в разные смены.
              </p>
              <p>
                Обратите внимание на тарифные зоны:
              </p>
              <ul>
                <li>
                  <strong>Пиковая зона</strong> - часы максимальной нагрузки на электросеть (обычно утренние и вечерние часы).
                  Тариф в этой зоне самый высокий.
                </li>
                <li>
                  <strong>Полупиковая зона</strong> - часы со средней нагрузкой на электросеть.
                  Тариф в этой зоне средний.
                </li>
                <li>
                  <strong>Ночная зона</strong> - часы минимальной нагрузки на электросеть (обычно ночное время).
                  Тариф в этой зоне самый низкий.
                </li>
              </ul>
              <p>
                Оптимизируя потребление электроэнергии с учетом тарифных зон, можно значительно снизить расходы
                на электроэнергию для вашего предприятия.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HourlyConsumptionPage;
