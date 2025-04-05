import React from 'react';
import './HourlyConsumptionPreview.css';

const HourlyConsumptionPreview = ({ data, onCalculate }) => {
  if (!data || !data.days || data.days.length === 0) {
    return null;
  }

  // Ограничиваем количество отображаемых дней для предварительного просмотра
  const maxDaysToShow = 10;
  const displayDays = data.days.slice(0, maxDaysToShow);
  const hasMoreDays = data.days.length > maxDaysToShow;

  // Подготовим заголовки часов
  const hourHeaders = [];
  for (let hour = 1; hour <= 24; hour++) {
    hourHeaders.push(
      <th key={`hour-${hour}`} title={`Час ${hour}:00`}>
        {hour}
      </th>
    );
  }

  // Форматирование чисел
  const formatConsumption = (value) => {
    return parseFloat(value).toFixed(3);
  };

  return (
    <div className="hourly-consumption-preview">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Предварительный просмотр данных потребления</h3>
        </div>
        <div className="card-body">
          <div className="alert alert-info mb-3">
            <strong>Предварительный просмотр:</strong> Таблица показывает почасовое потребление в кВтч для каждого дня.
            {hasMoreDays && ` Показаны первые ${maxDaysToShow} дней из ${data.days.length}.`}
          </div>
          
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Дата</th>
                  {hourHeaders}
                </tr>
              </thead>
              <tbody>
                {displayDays.map((day, index) => (
                  <tr key={`day-${index}`}>
                    <td>{day}</td>
                    {Array.from({ length: 24 }, (_, hourIndex) => {
                      const hour = hourIndex + 1;
                      const consumption = data.hoursData[day]?.[hour] || 0;
                      return (
                        <td 
                          key={`consumption-${day}-${hour}`} 
                          className={consumption > 0 ? "text-end has-value" : "text-end no-value"}
                          title={`${day}, ${hour}:00: ${consumption > 0 ? formatConsumption(consumption) : "Нет данных"} кВтч`}
                        >
                          {consumption > 0 ? formatConsumption(consumption) : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-center mt-4">
            <button 
              className="btn btn-primary btn-lg" 
              onClick={onCalculate}
            >
              Рассчитать
            </button>
          </div>
          
          <div className="mt-3">
            <div className="alert alert-info">
              <strong>Информация:</strong> Нажмите кнопку "Рассчитать" для выполнения расчета стоимости 
              по тарифным зонам для региона "Ростов-на-Дону".
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyConsumptionPreview;