import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import ExcelFormatHelper from './ExcelFormatHelper';
import { api } from '../services/api';

const ElectricityUsageAnalysis = () => {
  const [file, setFile] = useState(null);
  const [viewType, setViewType] = useState('hourly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [weekdayProfile, setWeekdayProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('usage');
  const [showFormatHelp, setShowFormatHelp] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setError(null); // Clear any previous errors
  };

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const loadChartData = async () => {
    if (!file) {
      setError('Пожалуйста, сначала выберите файл');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getChartData(file, viewType);
      if (response.success === false) {
        throw new Error(response.error || 'Ошибка загрузки данных');
      }
      setChartData(response);
    } catch (err) {
      setError(err.message || 'Не удалось загрузить данные графика');
      console.error('Error loading chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadWeekdayProfile = async () => {
    if (!file) {
      setError('Пожалуйста, сначала выберите файл');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getWeekdayProfile(file);
      if (response.success === false) {
        throw new Error(response.error || 'Ошибка загрузки данных');
      }
      setWeekdayProfile(response);
    } catch (err) {
      setError(err.message || 'Не удалось загрузить данные профиля по дням недели');
      console.error('Error loading weekday profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (activeTab === 'usage') {
      await loadChartData();
    } else {
      await loadWeekdayProfile();
    }
  };

  // Helper to prepare hourly chart data for Recharts
  const prepareHourlyChartData = () => {
    if (!chartData || !chartData.series || chartData.series.length === 0) {
      return [];
    }

    // For hourly view, let's show the first day's data
    const firstDayData = chartData.series[0];
    
    return firstDayData.points.map(point => ({
      hour: `${point.hour}:00`,
      value: point.value,
      isOutlier: point.isOutlier
    }));
  };

  // Helper to prepare daily chart data for Recharts
  const prepareDailyChartData = () => {
    if (!chartData || !chartData.series || chartData.series.length === 0) {
      return [];
    }

    const dailyData = chartData.series[0];
    
    return dailyData.points.map(point => ({
      date: point.date,
      value: point.value,
      isOutlier: point.isOutlier
    }));
  };

  // Helper to prepare weekday profile chart data for Recharts
  const prepareWeekdayProfileData = () => {
    if (!weekdayProfile || !weekdayProfile.series || weekdayProfile.series.length === 0) {
      return [];
    }
    
    return weekdayProfile.series.map(item => ({
      day: item.date,
      value: item.day_value
    }));
  };

  const hourlyChartData = prepareHourlyChartData();
  const dailyChartData = prepareDailyChartData();
  const weekdayProfileData = prepareWeekdayProfileData();

  // Function to determine color based on outlier status
  const getBarFill = (entry) => {
    return entry.isOutlier ? 'rgba(255, 99, 132, 0.7)' : 'rgba(54, 162, 235, 0.7)';
  };

  const renderChart = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      );
    }

    if (activeTab === 'usage') {
      if (viewType === 'hourly' && hourlyChartData.length > 0) {
        return (
          <div style={{ height: '400px', marginTop: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={hourlyChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  label={{ value: 'Час дня', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  label={{ value: 'Потребление энергии (кВтч)', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                  formatter={(value, name, props) => {
                    return [`${value} кВтч`, 'Потребление'];
                  }}
                  labelFormatter={(label) => `Время: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Потребление энергии"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={payload.isOutlier ? 6 : 4} 
                        fill={payload.isOutlier ? 'rgba(255, 99, 132, 0.7)' : 'rgba(54, 162, 235, 0.7)'} 
                        stroke={payload.isOutlier ? '#ff6384' : '#36a2eb'}
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      } else if (viewType === 'daily' && dailyChartData.length > 0) {
        return (
          <div style={{ height: '400px', marginTop: '1.5rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  label={{ value: 'Дата', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  label={{ value: 'Потребление энергии (кВтч)', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                  formatter={(value, name, props) => {
                    return [`${value} кВтч`, 'Потребление'];
                  }}
                  labelFormatter={(label) => `Дата: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Ежедневное потребление"
                  stroke="#2196f3"
                  activeDot={{ r: 8 }}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={payload.isOutlier ? 6 : 4} 
                        fill={payload.isOutlier ? 'rgba(255, 99, 132, 0.7)' : 'rgba(54, 162, 235, 0.7)'} 
                        stroke={payload.isOutlier ? '#ff6384' : '#36a2eb'}
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      }
    } else if (activeTab === 'weekday' && weekdayProfileData.length > 0) {
      return (
        <div style={{ height: '400px', marginTop: '1.5rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weekdayProfileData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                label={{ value: 'День недели', position: 'insideBottomRight', offset: -10 }} 
              />
              <YAxis 
                label={{ value: 'Среднее потребление энергии (кВтч)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  return [`${value} кВтч`, 'Среднее потребление'];
                }}
                labelFormatter={(label) => `День: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Среднее потребление энергии" 
                fill="#9c27b0" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div className="p-4 text-center">
        <p className="text-secondary">
          Загрузите Excel файл и нажмите кнопку "Анализировать", чтобы увидеть статистику потребления электроэнергии.
        </p>
      </div>
    );
  };

  return (
    <div className="container-fluid mt-4 mb-4">
      <div className="card">
        <div className="card-header">
          <h2 className="h5">Анализ потребления электроэнергии</h2>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <input
                  accept=".xlsx,.xls"
                  style={{ display: 'none' }}
                  id="raised-button-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="raised-button-file">
                  <button 
                    className="btn btn-primary" 
                    onClick={() => document.getElementById('raised-button-file').click()}
                  >
                    Загрузить Excel файл
                  </button>
                </label>
                {file && (
                  <p className="text-muted mt-2 mb-0">
                    Выбранный файл: {file.name}
                  </p>
                )}
                <button 
                  type="button" 
                  className="btn btn-link" 
                  onClick={() => setShowFormatHelp(!showFormatHelp)}
                >
                  {showFormatHelp ? 'Скрыть формат' : 'Показать формат файла'}
                </button>
              </div>
              
              {showFormatHelp && (
                <ExcelFormatHelper />
              )}
            </div>
            
            <div className="col-12 col-md-6">
              <div className="d-flex gap-2">
                <button 
                  type="button"
                  className={`btn ${activeTab === 'usage' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleTabChange('usage')}
                >
                  Анализ потребления
                </button>
                <button 
                  type="button"
                  className={`btn ${activeTab === 'weekday' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleTabChange('weekday')}
                >
                  Профиль по дням недели
                </button>
              </div>
            </div>
            
            {activeTab === 'usage' && (
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label htmlFor="viewType" className="form-label">Тип отображения</label>
                  <select
                    className="form-select"
                    id="viewType"
                    value={viewType}
                    onChange={handleViewTypeChange}
                  >
                    <option value="hourly">Почасовой</option>
                    <option value="daily">По дням</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="col-12 col-md-6">
              <button 
                type="button"
                className="btn btn-primary" 
                onClick={handleAnalyze}
                disabled={loading || !file}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Загрузка...
                  </>
                ) : 'Анализировать'}
              </button>
            </div>
          </div>
          
          {renderChart()}
          
          {chartData && viewType === 'hourly' && chartData.series.length > 1 && (
            <div className="mt-3">
              <div className="alert alert-info">
                Обнаружены данные за несколько дней. Показан только первый день. Переключитесь на режим "По дням", чтобы увидеть сводные данные за все дни.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectricityUsageAnalysis;
