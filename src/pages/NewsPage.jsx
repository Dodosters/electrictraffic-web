import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './NewsPage.css';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.getNews();
        if (response.success) {
          setNews(response.data);
        } else {
          throw new Error('Failed to fetch news');
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Не удалось загрузить новости. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = async (id) => {
    if (selectedNews && selectedNews.id === id) {
      setSelectedNews(null);
      return;
    }

    try {
      setLoading(true);
      const response = await api.getNewsById(id);
      if (response.success) {
        setSelectedNews(response.data);
      } else {
        throw new Error('Failed to fetch news details');
      }
    } catch (err) {
      console.error('Error fetching news details:', err);
      setError('Не удалось загрузить детальную информацию о новости. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  return (
    <div className="news-page">
      <div className="container mt-5 pt-5">
        <h1 className="h-primary text-center">Новости</h1>
        <div className="section-divider"></div>
        
        {loading && news.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-3">Загрузка новостей...</p>
          </div>
        ) : error && news.length === 0 ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <>
            <p className="text-center mb-5">
              Актуальные новости об изменениях тарифов на электроэнергию, законодательства в сфере энергетики
              и развитии нашего сервиса.
            </p>
            
            <div className="row">
              {selectedNews ? (
                <div className="col-lg-8 mx-auto">
                  <div className="news-back-link mb-4">
                    <button 
                      className="btn btn-link ps-0" 
                      onClick={() => setSelectedNews(null)}
                    >
                      ← Назад к списку новостей
                    </button>
                  </div>
                  
                  <div className="news-details">
                    <h2 className="news-title">{selectedNews.title}</h2>
                    <div className="news-date">{formatDate(selectedNews.date)}</div>
                    <div className="news-content">
                      {selectedNews.content.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-lg-8 mx-auto">
                  <div className="news-list">
                    {news.map(item => (
                      <div key={item.id} className="news-item" onClick={() => handleNewsClick(item.id)}>
                        <div className="news-item-date">{formatDate(item.date)}</div>
                        <h3 className="news-item-title">{item.title}</h3>
                        <p className="news-item-summary">{item.summary}</p>
                        <button className="news-item-more">Читать далее</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {!selectedNews && (
              <div className="text-center mt-5">
                <button className="btn btn-b-primary">Загрузить еще</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
