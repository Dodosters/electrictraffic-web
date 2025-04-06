import React, { useState, useEffect } from 'react';

const HourlyZoneEditor = () => {
  // Значения для зон: 0 - обычный, 1 - полупик, 2 - пик
  const [hourlyZones, setHourlyZones] = useState(Array(24).fill(0));
  const [savedStatus, setSavedStatus] = useState('');
  
  // Загрузка данных из localStorage при монтировании компонента
  useEffect(() => {
    const savedZones = localStorage.getItem('hourlyZones');
    if (savedZones) {
      setHourlyZones(JSON.parse(savedZones));
    }
  }, []);
  
  // Сохранение данных вручную
  const saveZones = () => {
    localStorage.setItem('hourlyZones', JSON.stringify(hourlyZones));
    setSavedStatus('Зоны сохранены!');
    setTimeout(() => setSavedStatus(''), 3000);
  };
  
  // Изменение состояния при клике
  const handleCellClick = (hourIndex) => {
    const newZones = [...hourlyZones];
    // Циклически меняем состояние: 0 -> 1 -> 2 -> 0
    newZones[hourIndex] = (newZones[hourIndex] + 1) % 3;
    setHourlyZones(newZones);
    setSavedStatus('');
  };

  // Предустановки для быстрой настройки
  const applyPreset = (preset) => {
    let newZones = [...hourlyZones];
    
    if (preset === 'default') {
      // Пик: 8-11, 16-21
      // Ночь (обычный): 23-7
      // Полупик: остальные часы
      newZones = newZones.map((_, index) => {
        if ([8, 9, 10, 11, 16, 17, 18, 19, 20, 21].includes(index)) {
          return 2; // Пик
        } else if ([23, 0, 1, 2, 3, 4, 5, 6, 7].includes(index)) {
          return 0; // Обычный (ночь)
        } else {
          return 1; // Полупик
        }
      });
    } else if (preset === 'allNormal') {
      newZones = Array(24).fill(0);
    } else if (preset === 'allSemiPeak') {
      newZones = Array(24).fill(1);
    } else if (preset === 'allPeak') {
      newZones = Array(24).fill(2);
    }
    
    setHourlyZones(newZones);
    setSavedStatus('');
  };
  
  // Получение класса стиля для ячейки в зависимости от состояния
  const getCellClass = (zoneValue) => {
    switch(zoneValue) {
      case 0: return 'bg-light'; // обычный
      case 1: return 'bg-warning'; // полупик
      case 2: return 'bg-danger text-white'; // пик
      default: return 'bg-light';
    }
  };
  
  // Получение текста для ячейки в зависимости от состояния
  const getCellText = (zoneValue) => {
    switch(zoneValue) {
      case 0: return 'Обычный';
      case 1: return 'Полупик';
      case 2: return 'Пик';
      default: return 'Обычный';
    }
  };
  
  // Форматирование часа для отображения
  const formatHour = (hour) => {
    return `${hour}:00`;
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h3 className="card-title mb-0">Настройка часовых зон</h3>
        <div>
          <span className="badge bg-light text-dark me-2">Обычный</span>
          <span className="badge bg-warning me-2">Полупик</span>
          <span className="badge bg-danger">Пик</span>
        </div>
      </div>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="text-muted mb-0">
            Нажмите на ячейку, чтобы изменить тип зоны (Обычный → Полупик → Пик → Обычный)
          </p>
          <div className="d-flex align-items-center">
            {savedStatus && (
              <div className="alert alert-success py-1 px-3 mb-0 me-3">
                {savedStatus}
              </div>
            )}
            <div className="btn-group me-2">
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => applyPreset('default')}
                title="Стандартное распределение (Пик: 8-11, 16-21; Ночь: 23-7; Полупик: остальные)"
              >
                Стандартная схема
              </button>
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => applyPreset('allNormal')}
              >
                Все обычные
              </button>
              <button 
                className="btn btn-sm btn-outline-warning" 
                onClick={() => applyPreset('allSemiPeak')}
              >
                Все полупик
              </button>
              <button 
                className="btn btn-sm btn-outline-danger" 
                onClick={() => applyPreset('allPeak')}
              >
                Все пик
              </button>
            </div>
            <button 
              className="btn btn-sm btn-success" 
              onClick={saveZones}
            >
              Сохранить зоны
            </button>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th colSpan={12} className="text-center">AM (00:00 - 11:59)</th>
                <th colSpan={12} className="text-center">PM (12:00 - 23:59)</th>
              </tr>
              <tr>
                {Array.from({ length: 24 }).map((_, i) => (
                  <th key={i} className="text-center" style={{ width: '4.16%' }}>
                    {i}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {hourlyZones.map((zone, index) => (
                  <td 
                    key={index} 
                    className={`text-center ${getCellClass(zone)}`}
                    onClick={() => handleCellClick(index)}
                    style={{ cursor: 'pointer', height: '60px' }}
                  >
                    <div className="d-flex flex-column justify-content-center h-100">
                      <div>{formatHour(index)}</div>
                      <small>{getCellText(zone)}</small>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HourlyZoneEditor;