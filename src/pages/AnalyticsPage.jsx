import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.getAnalyticsData();
        if (response.success) {
          setAnalyticsData(response.data);
        } else {
          throw new Error('Failed to fetch analytics data');
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Не удалось загрузить аналитические данные. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  return (
    <div className="analytics-page">
      <div className="container mt-5 pt-5">
        <h1 className="h-primary text-center">Аналитика тарифов</h1>
        <div className="devider mx-auto"></div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-3">Загрузка аналитических данных...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <>
            <p className="text-center mb-5">
              Аналитические данные о динамике тарифов на электроэнергию по регионам России, 
              изменениях цен с течением времени и прогнозах на будущее.
            </p>
            
            <div className="row mb-5">
              <div className="col-lg-12">
                <div className="card analytics-card">
                  <div className="card-header">
                    <h3 className="card-title">Сравнение тарифов по регионам</h3>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={analyticsData.regionalComparison}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} руб/кВтч`, 'Средний тариф']} />
                        <Legend />
                        <Bar dataKey="averageRate" name="Средний тариф (руб/кВтч)" fill="#1e1e1e" />
                        <Bar dataKey="change" name="Изменение в %" fill="#757575" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row mb-5">
              <div className="col-lg-8">
                <div className="card analytics-card">
                  <div className="card-header">
                    <h3 className="card-title">Динамика изменения тарифов</h3>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={analyticsData.yearlyTrends}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} руб/кВтч`, 'Средний тариф']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="averageRate" 
                          name="Средний тариф (руб/кВтч)" 
                          stroke="#1e1e1e" 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-4">
                <div className="card analytics-card">
                  <div className="card-header">
                    <h3 className="card-title">Распределение тарифов</h3>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={analyticsData.regionalComparison}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="averageRate"
                          nameKey="region"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {analyticsData.regionalComparison.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} руб/кВтч`, 'Средний тариф']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row mb-5">
              <div className="col-lg-12">
                <div className="card analytics-card">
                  <div className="card-header">
                    <h3 className="card-title">Прогноз тарифов на ближайшее время</h3>
                  </div>
                  <div className="card-body">
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={analyticsData.forecastData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tickFormatter={(value, index) => `${value} Q${analyticsData.forecastData[index].quarter}`} />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip formatter={(value) => [`${value} руб/кВтч`, 'Прогнозируемый тариф']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="predictedRate" 
                          name="Прогнозируемый тариф (руб/кВтч)" 
                          stroke="#FF8042" 
                          strokeDasharray="5 5"
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5">
              <h2 className="h4 mb-4">Методология анализа</h2>
              <p>
                Анализ тарифов на электроэнергию проводится на основе официальных данных, 
                публикуемых региональными энергетическими комиссиями и поставщиками электроэнергии.
                Для прогнозирования будущих изменений используются статистические методы и экспертные оценки.
              </p>
              <p>
                Представленные данные обновляются ежеквартально и могут использоваться для планирования 
                расходов на электроэнергию как физическими, так и юридическими лицами.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
