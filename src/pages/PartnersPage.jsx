import { useState } from 'react';
import './PartnersPage.css';

const PartnersPage = () => {
  const [activeTab, setActiveTab] = useState('api');

  return (
    <div className="partners-page">
      <div className="container mt-5 pt-5">
        <h1 className="h-primary text-center">Для партнеров</h1>
        <div className="section-divider socket"></div>
        
        <p className="text-center mb-5">
          Интегрируйте данные о тарифах на электроэнергию в ваши продукты и сервисы с помощью нашего API
          или станьте партнером ТНС-энерго и предоставляйте актуальные данные для наших пользователей.
        </p>
        
        <div className="row">
          <div className="col-lg-3">
            <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
              <button 
                className={`nav-link ${activeTab === 'api' ? 'active' : ''}`} 
                onClick={() => setActiveTab('api')}
              >
                API для разработчиков
              </button>
              <button 
                className={`nav-link ${activeTab === 'integration' ? 'active' : ''}`} 
                onClick={() => setActiveTab('integration')}
              >
                Варианты интеграции
              </button>
              <button 
                className={`nav-link ${activeTab === 'pricing' ? 'active' : ''}`} 
                onClick={() => setActiveTab('pricing')}
              >
                Тарифы и условия
              </button>
              <button 
                className={`nav-link ${activeTab === 'partnership' ? 'active' : ''}`} 
                onClick={() => setActiveTab('partnership')}
              >
                Партнерская программа
              </button>
            </div>
          </div>
          
          <div className="col-lg-9">
            <div className="tab-content">
              {activeTab === 'api' && (
                <div className="tab-pane fade show active">
                  <h2 className="subhead-api mb-4">API для разработчиков</h2>
                  <p>
                    Наше API предоставляет доступ к актуальным данным о тарифах на электроэнергию по всем регионам России.
                    Вы можете использовать эти данные для создания собственных калькуляторов, аналитических инструментов
                    и других сервисов.
                  </p>
                  
                  <div className="api-endpoints mt-4">
                    <h3 className="h5 mb-3">Эндпоинты API:</h3>
                    
                    <h4 className="mt-4 mb-2">Тарифы для бизнеса</h4>
                    <div className="api-endpoint">
                      <div className="endpoint-method">GET</div>
                      <div className="endpoint-url">/business-tariffs</div>
                      <div className="endpoint-desc">Получение тарифов для юридических лиц</div>
                    </div>
                    
                    <div className="api-endpoint">
                      <div className="endpoint-method">GET</div>
                      <div className="endpoint-url">/business-tariffs/{'{region}'}</div>
                      <div className="endpoint-desc">Получение тарифов для юридических лиц по региону</div>
                    </div>
                    
                    <h4 className="mt-4 mb-2">Тарифы для населения</h4>
                    <div className="api-endpoint">
                      <div className="endpoint-method">GET</div>
                      <div className="endpoint-url">/personal-tariffs</div>
                      <div className="endpoint-desc">Получение тарифов для физических лиц</div>
                    </div>
                    
                    <div className="api-endpoint">
                      <div className="endpoint-method">GET</div>
                      <div className="endpoint-url">/personal-tariffs/{'{region}'}</div>
                      <div className="endpoint-desc">Получение тарифов для физических лиц по региону</div>
                    </div>
                    
                    <h4 className="mt-4 mb-2">Энергетические компании</h4>
                    <div className="api-endpoint">
                      <div className="endpoint-method">GET</div>
                      <div className="endpoint-url">/providers</div>
                      <div className="endpoint-desc">Получение списка поставщиков электроэнергии</div>
                    </div>
                    
                    <div className="api-endpoint">
                      <div className="endpoint-method">GET</div>
                      <div className="endpoint-url">/providers/{'{id}'}</div>
                      <div className="endpoint-desc">Получение информации о конкретном поставщике</div>
                    </div>
                    
                    <h4 className="mt-4 mb-2">Расчет стоимости</h4>
                    <div className="api-endpoint">
                      <div className="endpoint-method">POST</div>
                      <div className="endpoint-url">/calculate/business</div>
                      <div className="endpoint-desc">Расчет стоимости электроэнергии для юридических лиц</div>
                    </div>
                    
                    <div className="api-endpoint">
                      <div className="endpoint-method">POST</div>
                      <div className="endpoint-url">/calculate/personal</div>
                      <div className="endpoint-desc">Расчет стоимости электроэнергии для физических лиц</div>
                    </div>
                    
                    <h4 className="mt-4 mb-2">Почасовое потребление</h4>
                    <div className="api-endpoint">
                      <div className="endpoint-method">POST</div>
                      <div className="endpoint-url">/process-hourly-consumption</div>
                      <div className="endpoint-desc">Обработка данных о почасовом потреблении (для предприятий)</div>
                    </div>
                    
                    <div className="api-endpoint">
                      <div className="endpoint-method">POST</div>
                      <div className="endpoint-url">/process-hourly-consumption-string</div>
                      <div className="endpoint-desc">Обработка данных о почасовом потреблении в формате строки</div>
                    </div>
                    
                    <h4 className="mt-4 mb-2">Новости и информация</h4>
                    <div className="api-endpoint">
                      <div className="endpoint-method">GET</div>
                      <div className="endpoint-url">/analytics</div>
                      <div className="endpoint-desc">Получение аналитических данных о тарифах</div>
                    </div>
                    
                    <div className="api-endpoint">
                      <div className="endpoint-method">GET</div>
                      <div className="endpoint-url">/faqs</div>
                      <div className="endpoint-desc">Получение часто задаваемых вопросов</div>
                    </div>
                    
                    <div className="api-endpoint">
                      <div className="endpoint-method">GET</div>
                      <div className="endpoint-url">/news</div>
                      <div className="endpoint-desc">Получение списка новостей</div>
                    </div>
                    
                    <div className="api-endpoint">
                      <div className="endpoint-method">GET</div>
                      <div className="endpoint-url">/news/{'{id}'}</div>
                      <div className="endpoint-desc">Получение детальной информации о новости</div>
                    </div>
                  </div>
                  
                  <div className="api-access mt-5">
                    <h3 className="h5 mb-3">Доступ к API</h3>
                    <p>
                      Для доступа к API необходимо получить API-ключ. Для этого зарегистрируйтесь на нашем сайте
                      и перейдите в личный кабинет, раздел "API-доступ".
                    </p>
                    <p>
                      API-ключ необходимо передавать в заголовке <code>X-API-Key</code> при каждом запросе.
                    </p>
                    <div className="code-example mt-3">
                      <pre>
                        <code>
                          {`// Пример запроса получения тарифов для населения
fetch("https://api.tns.ru/personal-tariffs", {
  headers: {
    "X-API-Key": "YOUR_API_KEY"
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Ошибка:", error));

// Пример расчета стоимости по почасовому потреблению
const hourlyData = {
  csvData: "Дата;Час;Потребление\\n01.02.2024;1;0,5\\n01.02.2024;2;0,7",
  region: "Ростов-на-Дону"
};

fetch("https://api.tns.ru/process-hourly-consumption-string", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "YOUR_API_KEY"
  },
  body: JSON.stringify(hourlyData)
})
.then(response => response.json())
.then(result => console.log(result))
.catch(error => console.error("Ошибка:", error));`}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'integration' && (
                <div className="tab-pane fade show active">
                  <h2 className="subhead-api mb-4">Варианты интеграции</h2>
                  <p>
                    Мы предлагаем несколько вариантов интеграции данных о тарифах в ваши продукты и сервисы:
                  </p>
                  
                  <div className="integration-options mt-4">
                    <div className="integration-option">
                      <h3 className="h5">REST API</h3>
                      <p>
                        Классический REST API с JSON-ответами. Подходит для большинства веб-приложений, мобильных
                        приложений и других сервисов.
                      </p>
                    </div>
                    
                    <div className="integration-option">
                      <h3 className="h5">Виджеты</h3>
                      <p>
                        Готовые JavaScript-виджеты, которые можно встроить на вашем сайте. Виджеты представляют собой
                        калькуляторы тарифов с настраиваемым дизайном.
                      </p>
                    </div>
                    
                    <div className="integration-option">
                      <h3 className="h5">Webhooks</h3>
                      <p>
                        Получайте уведомления об изменениях тарифов в реальном времени через webhooks.
                        Это поможет вам всегда иметь актуальные данные.
                      </p>
                    </div>
                    
                    <div className="integration-option">
                      <h3 className="h5">Пакетная выгрузка</h3>
                      <p>
                        Если вам нужны исторические данные или большой объем информации, мы предлагаем пакетную
                        выгрузку данных в форматах CSV, Excel или JSON.
                      </p>
                    </div>
                  </div>
                  
                  <div className="integration-support mt-5">
                    <h3 className="h5">Техническая поддержка</h3>
                    <p>
                      Наша команда разработчиков готова помочь вам с интеграцией. Мы предоставляем документацию,
                      примеры кода и консультации по техническим вопросам.
                    </p>
                    <p>
                      Для получения технической поддержки напишите нам на <a href="mailto:api@etarif.ru">api@tns.ru</a>.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'pricing' && (
                <div className="tab-pane fade show active">
                  <h2 className="subhead-api mb-4">Тарифы и условия</h2>
                  <p>
                    Мы предлагаем гибкие тарифные планы, которые подойдут как для стартапов, так и для крупных компаний.
                  </p>
                  
                  <div className="pricing-plans mt-4">
                    <div className="row">
                      <div className="col-md-4 mb-4">
                        <div className="pricing-card">
                          <div className="pricing-header">
                            <h3>Базовый</h3>
                            <div className="pricing">
                              <span className="price">0 ₽</span>
                              <span className="period">/ месяц</span>
                            </div>
                          </div>
                          <div className="pricing-body">
                            <ul className="pricing-features">
                              <li>До 1,000 запросов в месяц</li>
                              <li>Доступ к базовым эндпоинтам API</li>
                              <li>Обновление данных раз в неделю</li>
                              <li>Базовая техническая поддержка</li>
                            </ul>
                            <div className="pricing-action">
                              <button className="btn btn-f-primary btn-block">Начать бесплатно</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4 mb-4">
                        <div className="pricing-card pricing-card-pro">
                          <div className="pricing-header">
                            <h3>Профессиональный</h3>
                            <div className="pricing">
                              <span className="price">5,000 ₽</span>
                              <span className="period">/ месяц</span>
                            </div>
                          </div>
                          <div className="pricing-body">
                            <ul className="pricing-features">
                              <li>До 50,000 запросов в месяц</li>
                              <li>Доступ ко всем эндпоинтам API</li>
                              <li>Обновление данных ежедневно</li>
                              <li>Приоритетная техническая поддержка</li>
                              <li>Возможность использования виджетов</li>
                              <li>Доступ к историческим данным</li>
                            </ul>
                            <div className="pricing-action">
                              <button className="btn btn-f-primary btn-block">Выбрать план</button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4 mb-4">
                        <div className="pricing-card">
                          <div className="pricing-header">
                            <h3>Корпоративный</h3>
                            <div className="pricing">
                              <span className="price">Индивидуально</span>
                            </div>
                          </div>
                          <div className="pricing-body">
                            <ul className="pricing-features">
                              <li>Неограниченное количество запросов</li>
                              <li>Доступ ко всем эндпоинтам API</li>
                              <li>Обновление данных в реальном времени</li>
                              <li>Выделенная техническая поддержка</li>
                              <li>Кастомизация API под ваши потребности</li>
                              <li>Доступ к аналитическим данным</li>
                              <li>SLA с гарантией доступности</li>
                            </ul>
                            <div className="pricing-action">
                              <button className="btn btn-f-primary btn-block">Связаться с нами</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pricing-notes mt-4">
                    <p>
                      Все цены указаны без учета НДС. При оплате за год предоставляется скидка 20%.
                    </p>
                    <p>
                      Для некоммерческих организаций, образовательных учреждений и стартапов предусмотрены специальные условия.
                      Для получения информации о них, пожалуйста, свяжитесь с нами.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'partnership' && (
                <div className="tab-pane fade show active">
                  <h2 className="subhead-api mb-4">Партнерская программа</h2>
                  <p>
                    Станьте партнером ТНС-энерго и получайте комиссию за привлеченных клиентов или предоставляйте нам
                    актуальные данные о тарифах на электроэнергию.
                  </p>
                  
                  <div className="partnership-types mt-4">
                    <div className="partnership-type">
                      <h3 className="h5">Реферальная программа</h3>
                      <p>
                        Рекомендуйте наш сервис и получайте 20% от платежей привлеченных вами клиентов в течение первого года.
                        Мы предоставляем все необходимые маркетинговые материалы и уникальные реферальные ссылки для отслеживания.
                      </p>
                    </div>
                    
                    <div className="partnership-type">
                      <h3 className="h5">Интеграционное партнерство</h3>
                      <p>
                        Если у вас есть продукт или сервис, связанный с энергетикой, ЖКХ или финансами, мы можем
                        интегрировать наши услуги для создания комплексного решения для ваших клиентов.
                      </p>
                    </div>
                    
                    <div className="partnership-type">
                      <h3 className="h5">Поставщики данных</h3>
                      <p>
                        Если вы являетесь энергосбытовой компанией или имеете доступ к актуальной информации о тарифах,
                        мы готовы сотрудничать по обмену данными. Мы предлагаем различные варианты взаимовыгодного
                        сотрудничества.
                      </p>
                    </div>
                  </div>
                  
                  <div className="partnership-benefits mt-4">
                    <h3 className="h5 mb-3">Преимущества партнерства</h3>
                    <ul>
                      <li>Дополнительный источник дохода</li>
                      <li>Расширение вашего предложения для клиентов</li>
                      <li>Доступ к нашей аудитории</li>
                      <li>Совместные маркетинговые активности</li>
                      <li>Приоритетная техническая поддержка</li>
                      <li>Индивидуальные условия использования API</li>
                    </ul>
                  </div>
                  
                  <div className="partnership-contact mt-4">
                    <h3 className="h5 mb-3">Как стать партнером</h3>
                    <p>
                      Для присоединения к партнерской программе заполните форму заявки или свяжитесь с нами по электронной
                      почте <a href="mailto:partners@tns.ru">partners@tns.ru</a>.
                    </p>
                    <div className="mt-4">
                      <button className="btn btn-f-primary">Стать партнером</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;
