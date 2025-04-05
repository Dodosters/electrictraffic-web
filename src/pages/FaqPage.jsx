import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './FaqPage.css';

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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
  
  const handleOpenModal = () => {
    setShowModal(true);
    // Reset form state
    setFormData({ name: '', email: '', question: '' });
    setFormErrors({});
    setSubmitSuccess(false);
    setSubmitError(null);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Пожалуйста, введите ваше имя';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Пожалуйста, введите ваш email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Пожалуйста, введите корректный email';
    }
    
    if (!formData.question.trim()) {
      errors.question = 'Пожалуйста, введите ваш вопрос';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      // Call API to submit question
      const response = await api.submitQuestion(formData);
      
      if (response.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({ name: '', email: '', question: '' });
      } else {
        throw new Error(response.error || 'Не удалось отправить вопрос');
      }
    } catch (err) {
      console.error('Error submitting question:', err);
      setSubmitError('Произошла ошибка при отправке вопроса. Пожалуйста, попробуйте еще раз позже.');
    } finally {
      setSubmitting(false);
    }
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
              <button 
                className="btn btn-f-primary mt-3" 
                onClick={handleOpenModal}
              >
                Задать вопрос
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Модальное окно для отправки вопроса */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="question-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Задать вопрос</h3>
              <button className="close-button" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            
            {submitSuccess ? (
              <div className="modal-content">
                <div className="alert alert-success mb-4">
                  Ваш вопрос успешно отправлен! Мы свяжемся с вами в ближайшее время.
                </div>
                <div className="text-center">
                  <button className="btn btn-f-primary" onClick={handleCloseModal}>
                    Закрыть
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal-content">
                {submitError && (
                  <div className="alert alert-danger mb-4">
                    {submitError}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="name">Ваше имя</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Введите ваше имя"
                    />
                    {formErrors.name && (
                      <div className="invalid-feedback">{formErrors.name}</div>
                    )}
                  </div>
                  
                  <div className="form-group mb-3">
                    <label htmlFor="email">Email для связи</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Введите ваш email"
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">{formErrors.email}</div>
                    )}
                  </div>
                  
                  <div className="form-group mb-4">
                    <label htmlFor="question">Ваш вопрос</label>
                    <textarea
                      className={`form-control ${formErrors.question ? 'is-invalid' : ''}`}
                      id="question"
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      placeholder="Опишите ваш вопрос подробно"
                      rows="5"
                    ></textarea>
                    {formErrors.question && (
                      <div className="invalid-feedback">{formErrors.question}</div>
                    )}
                  </div>
                  
                  <div className="form-group text-center">
                    <button 
                      type="submit" 
                      className="btn btn-f-primary btn-lg" 
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Отправка...
                        </>
                      ) : 'Отправить вопрос'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqPage;
