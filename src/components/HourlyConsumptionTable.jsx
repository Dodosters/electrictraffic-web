import React, { useState } from 'react';
import './HourlyConsumptionTable.css';

const HourlyConsumptionTable = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState(data?.hourlyData?.[0]?.date || '');

  if (!data || !data.hourlyData || data.hourlyData.length === 0) {
    return null;
  }

  // Получаем список дат
  const dates = data.hourlyData.map(day => day.date);

  // Находим выбранный день
  const selectedDay = data.hourlyData.find(day => day.date === selectedDate) || data.hourlyData[0];

  // Готовим данные для таблицы
  const tableData = [];
  
  for (let hour = 1; hour <= 24; hour++) {
    const hourData = selectedDay.hoursCost[hour] || {
      consumption: 0,
      rate: 0,
      zone: '',
      cost: 0
    };
    
    tableData.push({
      hour,
      ...hourData
    });
  }
  
  // Форматирование суммы
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Формирование класса для зоны
  const getZoneClass = (zone) => {
    switch (zone) {
      case 'Пик':
        return 'zone-peak';
      case 'Полупик':
        return 'zone-semi-peak';
      case 'Ночь':
        return 'zone-night';
      default:
        return '';
    }
  };

  return (
    <div className="hourly-consumption-table">
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title">Почасовое потребление электроэнергии</h3>
            <div className="date-selector">
              <select 
                className="form-select"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {dates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Час</th>
                  <th>Тарифная зона</th>
                  <th>Тариф (руб/кВтч)</th>
                  <th>Потребление (кВтч)</th>
                  <th>Стоимость (руб)</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map(hour => (
                  <tr key={hour.hour} className={getZoneClass(hour.zone)}>
                    <td>{hour.hour}:00</td>
                    <td>{hour.zone}</td>
                    <td>{hour.rate.toFixed(2)}</td>
                    <td>{hour.consumption.toFixed(3)}</td>
                    <td>{formatCurrency(hour.cost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="table-summary">
                  <td colSpan="3" className="text-end fw-bold">Итого за день:</td>
                  <td className="fw-bold">
                    {Object.values(selectedDay.hoursCost)
                      .reduce((sum, hour) => sum + hour.consumption, 0)
                      .toFixed(3)} кВтч
                  </td>
                  <td className="fw-bold">{formatCurrency(selectedDay.dailyTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="tariff-legend mt-4">
            <h4 className="legend-title">Тарифные зоны:</h4>
            <div className="legend-items">
              <div className="legend-item zone-peak">
                <span className="legend-color"></span>
                <span className="legend-text">Пик: {data.zoneTariffs?.peak.toFixed(2)} руб/кВтч</span>
              </div>
              <div className="legend-item zone-semi-peak">
                <span className="legend-color"></span>
                <span className="legend-text">Полупик: {data.zoneTariffs?.semiPeak.toFixed(2)} руб/кВтч</span>
              </div>
              <div className="legend-item zone-night">
                <span className="legend-color"></span>
                <span className="legend-text">Ночь: {data.zoneTariffs?.night.toFixed(2)} руб/кВтч</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyConsumptionTable;
