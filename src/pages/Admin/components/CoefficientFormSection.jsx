import React from 'react';

const CoefficientFormSection = ({ title, data, onChange, path = '' }) => {
  const handleChange = (key, value) => {
    // Convert to number if it's a numeric string
    const newValue = !isNaN(parseFloat(value)) && isFinite(value)
      ? parseFloat(value)
      : value;
      
    onChange(`${path}${path ? '.' : ''}${key}`, newValue);
  };

  // Special renderer for power_tarif which is a common pattern in all categories
  const renderPowerTarif = (powerTarif, currentPath) => {
    return (
      <div className="card mt-2 mb-3">
        <div className="card-header bg-light">
          <h5 className="mb-0">Тарифы мощности</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {Object.entries(powerTarif).map(([key, value]) => (
              <div className="col-md-3 mb-2" key={`${currentPath}.power_tarif.${key}`}>
                <div className="form-group">
                  <label htmlFor={`${currentPath}.power_tarif.${key}`}>{key}</label>
                  <input
                    id={`${currentPath}.power_tarif.${key}`}
                    className="form-control"
                    value={value}
                    onChange={(e) => handleChange(`power_tarif.${key}`, e.target.value)}
                    type="number"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderFields = (obj, currentPath = '') => {
    return Object.entries(obj).map(([key, value]) => {
      const fullPath = `${currentPath}${currentPath ? '.' : ''}${key}`;
      
      // Special handling for power_tarif which is common across all categories
      if (key === 'power_tarif' && typeof value === 'object') {
        return renderPowerTarif(value, currentPath);
      }
      
      if (typeof value === 'object' && value !== null) {
        // Special handling for day_cost and night_cost in second category
        if (key === 'day_cost' || key === 'night_cost') {
          return (
            <div key={key} className="card mb-3">
              <div className="card-header bg-light">
                <h5 className="mb-0">{key === 'day_cost' ? 'Дневные затраты' : 'Ночные затраты'}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {renderFields(value, fullPath)}
                </div>
              </div>
            </div>
          );
        }
        
        // Generic object rendering for other cases
        return (
          <div key={key} className="card mb-3">
            <div className="card-header" id={`heading-${key}`}>
              <h5 className="mb-0">
                <button 
                  className="btn btn-link text-decoration-none" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target={`#collapse-${fullPath.replace(/\./g, '-')}`} 
                  aria-expanded="true" 
                  aria-controls={`collapse-${fullPath.replace(/\./g, '-')}`}
                >
                  {formatLabel(key)}
                </button>
              </h5>
            </div>

            <div 
              id={`collapse-${fullPath.replace(/\./g, '-')}`} 
              className="collapse show" 
              aria-labelledby={`heading-${key}`}
            >
              <div className="card-body">
                <div className="row">
                  {renderFields(value, fullPath)}
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // Handle compensation field differently - it's a special case in the second category
        if (key === 'compensation') {
          return (
            <div className="col-md-12 mb-3" key={fullPath}>
              <div className="form-group">
                <label htmlFor={fullPath}>{formatLabel(key)}</label>
                <input
                  id={fullPath}
                  className="form-control"
                  value={value}
                  onChange={(e) => handleChange(key, e.target.value)}
                  type="number"
                  step="0.01"
                />
              </div>
            </div>
          );
        }
        
        // Skip power_tarif since we handle it specially above
        if (fullPath.includes('power_tarif')) {
          return null;
        }
        
        // Default field rendering for primitive values
        return (
          <div className="col-md-4 mb-3" key={fullPath}>
            <div className="form-group">
              <label htmlFor={fullPath}>{formatLabel(key)}</label>
              <input
                id={fullPath}
                className="form-control"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                type={typeof value === 'number' ? 'number' : 'text'}
                step={typeof value === 'number' ? 0.01 : undefined}
              />
            </div>
          </div>
        );
      }
    });
  };

  const formatLabel = (key) => {
    // Format snake_case or camelCase to Title Case with better Russian translations
    const translations = {
      'price_mean': 'Средняя цена',
      'another_service': 'Другие услуги',
      'sales_for_control': 'Сбыт для контроля',
      'sales': 'Продажи',
      'power_tarif': 'Тариф мощности',
      'day_cost': 'Дневная стоимость',
      'night_cost': 'Ночная стоимость',
      'compensation': 'Компенсация',
      'cost_for_power': 'Стоимость электроэнергии',
      'cost_for_onestuff': 'Стоимость за единицу',
      'cost_for_power_broadcast': 'Стоимость трансляции энергии',
      'VN': 'ВН (Высокое напряжение)',
      'SN1': 'СН1 (Среднее напряжение 1)',
      'SN2': 'СН2 (Среднее напряжение 2)',
      'NN': 'НН (Низкое напряжение)'
    };
    
    return translations[key] || key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h3 className="card-title mb-0">{title}</h3>
      </div>
      <div className="card-body">
        <div className="row">
          {renderFields(data, path)}
        </div>
      </div>
    </div>
  );
};

export default CoefficientFormSection;