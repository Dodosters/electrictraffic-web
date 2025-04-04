import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './FaqPage.css';

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await api.getFAQs();
        if (response.success) {
          setFaqs(response.data);
        } else {
          throw new Error('Failed to fetch FAQs');
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Не удалось загрузить часто задаваемые вопросы. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="container mt-5 pt-5">
        <h1 className="h-primary text-center">Часто задаваемые вопросы</h1>
        <div className="devider mx-auto"></div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-3">Загрузка вопросов и ответов...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <>
            <p className="text-center mb-5">
              Ответы на наиболее часто задаваемые вопросы о тарифах на электроэнергию и нашем сервисе.
              Если вы не нашли ответ на свой вопрос, свяжитесь с нами.
            </p>
            
            <div className="faq-container">
              {faqs.map((faq, index) => (
                <div 
                  key={faq.id}
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  <div className="faq-question">
                    <h3>{faq.question}</h3>
                    <div className="faq-icon">
                      <span className="plus">+</span>
                      <span className="minus">-</span>
                    </div>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-5 text-center">
              <h2 className="h4 mb-4">Не нашли ответ на свой вопрос?</h2>
              <p>
                Свяжитесь с нашей службой поддержки, и мы с радостью поможем вам разобраться с любыми вопросами
                о тарифах на электроэнергию или использовании нашего сервиса.
              </p>
              <button className="btn btn-f-primary mt-3">Задать вопрос</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FaqPage;
