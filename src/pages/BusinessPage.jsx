import { useState, useEffect } from 'react';
import { api } from '../services/api';
import BusinessCalculator from '../components/BusinessCalculator';
import './BusinessPage.css';

const BusinessPage = () => {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        setLoading(true);
        const response = await api.getBusinessTariffs();
        if (response.success) {
          setTariffs(response.data);
        } else {
          throw new Error('Failed to fetch tariffs');
        }
      } catch (err) {
        console.error('Error fetching tariffs:', err);
        setError('Не удалось загрузить данные о тарифах. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchTariffs();
  }, []);

  return (
    <div className="business-page">
      <div className="container mt-5 pt-5">
        <h1 className="h-primary text-center">Калькулятор тарифов для юридических лиц</h1>
        <div className="section-divider"></div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-3">Загрузка данных о тарифах...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <>
            <p className="text-center mb-5">
              Используйте наш калькулятор для расчета стоимости электроэнергии для вашего бизнеса в Ростове-на-Дону.
              Выберите тип тарифной мощности и введите объем потребления.
            </p>
            
            <BusinessCalculator tariffs={tariffs} />
            
            <div className="mt-5 pt-4">
              <h2 className="h4 mb-4">Сравнение тарифов по городам Ростовской области</h2>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Город</th>
                      <th>Поставщик</th>
                      <th>Одноставочный тариф</th>
                      <th>Двухставочный тариф (день/ночь)</th>
                      <th>Трехставочный тариф (пик/полупик/ночь)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariffs.map(tariff => {
                      const oneRate = tariff.tariffTypes.find(t => t.name === 'Одноставочный');
                      const twoRate = tariff.tariffTypes.find(t => t.name === 'Двухставочный');
                      const threeRate = tariff.tariffTypes.find(t => t.name === 'Трехставочный');
                      
                      return (
                        <tr key={tariff.id}>
                          <td>{tariff.region}</td>
                          <td>{tariff.provider}</td>
                          <td>{oneRate ? `${oneRate.rate} ${oneRate.unit}` : 'Н/Д'}</td>
                          <td>
                            {twoRate ? 
                              `${twoRate.rates[0].rate}/${twoRate.rates[1].rate} ${twoRate.rates[0].unit}` : 
                              'Н/Д'
                            }
                          </td>
                          <td>
                            {threeRate ? 
                              `${threeRate.rates[0].rate}/${threeRate.rates[1].rate}/${threeRate.rates[2].rate} ${threeRate.rates[0].unit}` : 
                              'Н/Д'
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-5">
              <h2 className="h4 mb-4">Дополнительная информация</h2>
              <p>
                Тарифы на электроэнергию для юридических лиц в Ростовской области устанавливаются Региональной службой по тарифам (РСТ)
                и могут отличаться в зависимости от города, категории напряжения, объема потребления и других факторов.
              </p>
              <p>
                Для получения точной информации о тарифах и условиях поставки электроэнергии рекомендуем обратиться
                непосредственно в компанию "ТНС энерго Ростов-на-Дону", которая является гарантирующим поставщиком электроэнергии в Ростовской области.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BusinessPage;
