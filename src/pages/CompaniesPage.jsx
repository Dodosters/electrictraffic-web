import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './CompaniesPage.css';

const CompaniesPage = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await api.getProviders();
        if (response.success) {
          setProviders(response.data);
        } else {
          throw new Error('Failed to fetch providers');
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
        setError('Не удалось загрузить данные о поставщиках. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleProviderClick = async (id) => {
    if (selectedProvider && selectedProvider.id === id) {
      setSelectedProvider(null);
      return;
    }

    try {
      setLoading(true);
      const response = await api.getProviderById(id);
      if (response.success) {
        setSelectedProvider(response.data);
      } else {
        throw new Error('Failed to fetch provider details');
      }
    } catch (err) {
      console.error('Error fetching provider details:', err);
      setError('Не удалось загрузить детальную информацию о поставщике. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="companies-page">
      <div className="container mt-5 pt-5">
        <h1 className="h-primary text-center">Компании-поставщики электроэнергии</h1>
        <div className="section-divider"></div>
        
        {loading && providers.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-3">Загрузка данных о поставщиках...</p>
          </div>
        ) : error && providers.length === 0 ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <>
            <p className="text-center mb-5">
              Информация о компаниях-поставщиках электроэнергии в различных регионах России.
              Нажмите на компанию, чтобы узнать подробную информацию.
            </p>
            
            <div className="row">
              <div className="col-lg-4">
                <div className="list-group providers-list">
                  {providers.map(provider => (
                    <button
                      key={provider.id}
                      className={`list-group-item list-group-item-action ${selectedProvider && selectedProvider.id === provider.id ? 'active' : ''}`}
                      onClick={() => handleProviderClick(provider.id)}
                    >
                      <h3 className="h5 mb-1">{provider.name}</h3>
                      <p className="mb-1 small">{provider.regions.join(', ')}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="col-lg-8">
                {loading && selectedProvider ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Загрузка...</span>
                    </div>
                    <p className="mt-3">Загрузка детальной информации...</p>
                  </div>
                ) : error && selectedProvider ? (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                ) : selectedProvider ? (
                  <div className="provider-details">
                    <div className="card">
                      <div className="card-header">
                        <h2 className="card-title">{selectedProvider.name}</h2>
                      </div>
                      <div className="card-body">
                        <div className="mb-4">
                          <h3 className="h5 mb-3">Обслуживаемые регионы:</h3>
                          <ul className="list-regions">
                            {selectedProvider.regions.map((region, index) => (
                              <li key={index}>{region}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="h5 mb-3">Контактная информация:</h3>
                          <p><strong>Телефон:</strong> {selectedProvider.contacts.phone}</p>
                          <p><strong>Email:</strong> <a href={`mailto:${selectedProvider.contacts.email}`}>{selectedProvider.contacts.email}</a></p>
                          <p><strong>Веб-сайт:</strong> <a href={selectedProvider.website} target="_blank" rel="noreferrer">{selectedProvider.website}</a></p>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="h5 mb-3">Услуги:</h3>
                          <ul>
                            <li>Поставка электроэнергии</li>
                            <li>Подключение к электросетям</li>
                            <li>Техническое обслуживание</li>
                            <li>Консультации по энергосбережению</li>
                          </ul>
                        </div>
                        
                        <div className="mt-4">
                          <a href={selectedProvider.website} target="_blank" rel="noreferrer" className="btn btn-f-primary">
                            Перейти на сайт поставщика
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="provider-placeholder">
                    <div className="card">
                      <div className="card-body text-center py-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-building text-muted mb-3" viewBox="0 0 16 16">
                          <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-10Zm.5.5v9h6v-9h-6Z"/>
                          <path d="M2 2a2 2 0 0 0-2 2v1h16V4a2 2 0 0 0-2-2H2Zm14 3H0v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5Z"/>
                        </svg>
                        <h3 className="h5 text-muted">Выберите компанию-поставщика из списка слева для просмотра подробной информации</h3>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-5">
              <h2 className="h4 mb-4">Как выбрать поставщика электроэнергии</h2>
              <p>
                В России существует более 100 компаний-поставщиков электроэнергии, каждая из которых обслуживает
                определенные регионы. При выборе поставщика следует обратить внимание на следующие факторы:
              </p>
              <ul>
                <li>Тарифы и дополнительные услуги</li>
                <li>Качество обслуживания и доступность службы поддержки</li>
                <li>Способы оплаты и удобство интерфейса личного кабинета</li>
                <li>Репутация компании и отзывы клиентов</li>
              </ul>
              <p>
                В большинстве случаев потребители не имеют возможности выбрать поставщика электроэнергии,
                так как в каждом регионе действует гарантирующий поставщик, определенный государством. 
                Однако крупные предприятия могут заключать договоры с независимыми поставщиками.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
