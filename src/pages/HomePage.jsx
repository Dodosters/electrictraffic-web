import { Link } from 'react-router-dom';
import './HomePage.css';


const HomePage = () => {
  return (
    <div className="home-page">
      <section id="hero" className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 hero-img"></div>
            <div className="col-md-6">
              <h1>ТНС - Ростовская область</h1>
              <span className="hero-span">
                Цифровой сервис, объединивший всю необходимую информацию о ценах и тарифах на электрическую энергию в городах Ростовской области
              </span>
              
            </div>
          </div>
        </div>
      </section>

      <section id="calc" className="py-5 bg-light-gray">
        <div className="container">
          <h2 className="h-primary text-center">Тарифные калькуляторы</h2>
          <div className="section-divider"></div>
          <p className="text-center mb-5">
            Выберите тип тарифного калькулятора для расчета стоимости электроэнергии
          </p>

          <div className="row justify-content-center gy-4">
            <div className="col-md-4">
              <Link to="/fiz" className="calc-card d-block text-decoration-none p-4">
                <div className="d-flex align-items-center mb-3">
                  <svg width="65" height="65" viewBox="0 0 24 24" className="me-3" style={{ opacity: '0.6' }}>
                    <path fill="var(--bs-primary)" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                  <h3 className="h5 mb-0 primary-c">Для физических лиц</h3>
                </div>
                <p className="text-muted mb-0">
                  Расчет стоимости электроэнергии для жилых помещений с учетом льготных тарифов
                </p>
              </Link>
            </div>
            
            <div className="col-md-4">
              <Link to="/hourly" className="calc-card d-block text-decoration-none p-4">
                <div className="d-flex align-items-center mb-3">
                  <svg width="65" height="65" viewBox="0 0 24 24" className="me-3" style={{ opacity: '0.6' }}>
                    <path fill="var(--bs-primary)" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                  </svg>
                  <h3 className="h5 mb-0 primary-c">Для предприятия</h3>
                </div>
                <p className="text-muted mb-0">
                  Анализ и расчет стоимости электроэнергии на основе данных о почасовом потреблении
                </p>
              </Link>
            </div>
          </div>
          
          <div className="row mt-4">
            <div className="col-12">
              <Link to="/ai-assistant" className="ai-promo-card d-block text-decoration-none">
                <div className="ai-promo-content">
                  <h3 className="ai-promo-title">AI-помощник по электроэнергии</h3>
                  <p className="ai-promo-text">
                    Задайте вопрос нашему умному помощнику! Он поможет разобраться в тарифах, 
                    рассчитать стоимость электроэнергии и даст рекомендации по энергосбережению.
                  </p>
                  <button className="ai-promo-btn">
                    Спросить AI-помощника
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ms-2" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                    </svg>
                  </button>
                </div>
                <svg className="ai-promo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="white" d="M21,11.25H16.87a2.5,2.5,0,0,0-2.5,2.5v6.5a2.5,2.5,0,0,0,2.5,2.5H21a2.5,2.5,0,0,0,2.5-2.5v-6.5A2.5,2.5,0,0,0,21,11.25Zm1.5,9a1.5,1.5,0,0,1-1.5,1.5H16.87a1.5,1.5,0,0,1-1.5-1.5v-6.5a1.5,1.5,0,0,1,1.5-1.5H21a1.5,1.5,0,0,1,1.5,1.5ZM20.5,1.25h-9a3.5,3.5,0,0,0-3.5,3.5v6.5a3.5,3.5,0,0,0,3.5,3.5H12a.47.47,0,0,0,.35-.15l2.5-2.5A.49.49,0,0,0,15,12h0a.48.48,0,0,0-.35-.15H11.5a1.5,1.5,0,0,1-1.5-1.5V4.75a1.5,1.5,0,0,1,1.5-1.5h9a1.5,1.5,0,0,1,1.5,1.5V9A.5.5,0,0,0,22.5,9h0a.5.5,0,0,0,.5-.5v-4A3.5,3.5,0,0,0,20.5,1.25ZM2.5,11.25h9a.47.47,0,0,0,.35-.15l2.5-2.5A.49.49,0,0,0,14.5,8a.48.48,0,0,0-.35-.15H11.5a3.5,3.5,0,0,0-3.5,3.5v6.5a3.5,3.5,0,0,0,3.5,3.5.5.5,0,0,0,.5-.5.5.5,0,0,0-.5-.5,2.5,2.5,0,0,1-2.5-2.5v-6.5a2.5,2.5,0,0,1,2-2.45v-.05H2.5a1.5,1.5,0,0,1-1.5-1.5V1.75A1.5,1.5,0,0,1,2.5.25h8a.5.5,0,0,0,.5-.5.5.5,0,0,0-.5-.5h-8A2.5,2.5,0,0,0,0,1.75V7.25A2.5,2.5,0,0,0,2.5,9.75h6.37a.5.5,0,0,0,.5-.5.5.5,0,0,0-.5-.5H2.5a1.5,1.5,0,0,1-1.5-1.5V4.85A2.49,2.49,0,0,0,2.5,5.75H5a.5.5,0,0,0,.5-.5A.5.5,0,0,0,5,4.75H2.5a1.5,1.5,0,0,1-1.5-1.5v-.5A2.5,2.5,0,0,0,2.5,4.25H5a.5.5,0,0,0,.5-.5.5.5,0,0,0-.5-.5H2.5a1.5,1.5,0,0,1-1.5-1.5A1.5,1.5,0,0,1,2.5.25h0A2.5,2.5,0,0,0,0,2.75v4.5A2.5,2.5,0,0,0,2.5,9.75h9a1.5,1.5,0,0,1-1.5,1.5Z" transform="translate(0 0.75)"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-5">
        <div className="container">
          <h2 className="h-primary text-center">О сервисе</h2>
          <div className="section-divider socket"></div>
          <p className="text-center mb-5">
            ТНС — это цифровой сервис, который помогает пользователям быстро и легко ориентироваться
            в тарифах на электроэнергию
          </p>

          <div className="row justify-content-center gy-4">
            <div className="col-md-4">
              <div className="about-card p-4">
                <div className="text-center mb-3">
                  <div className="img-circle mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 16 16">
                      <path d="M2 10h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1zm9-9h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 1h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                    </svg>
                  </div>
                  <h3 className="h5 mt-3 primary-c">Удобный калькулятор</h3>
                </div>
                <p className="text-muted text-center">
                  Рассчитывайте стоимость электроэнергии за любой период с учетом разных тарифных зон
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="about-card p-4">
                <div className="text-center mb-3">
                  <div className="img-circle mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 16 16">
                      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.93 4.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                  </div>
                  <h3 className="h5 mt-3 primary-c">Актуальные данные</h3>
                </div>
                <p className="text-muted text-center">
                  Всегда актуальная информация о тарифах на электроэнергию по всем городам Ростовской области
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="about-card p-4">
                <div className="text-center mb-3">
                  <div className="img-circle mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 16 16">
                      <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935z"/>
                    </svg>
                  </div>
                  <h3 className="h5 mt-3 primary-c">Аналитика</h3>
                </div>
                <p className="text-muted text-center">
                  Сравнение тарифов между городами Ростовской области и отслеживание динамики изменения цен
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="slog" className="py-5 text-center">
        <div className="container">
          <p className="mx-auto">
            Экономия начинается с информации
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
