import { useState } from 'react';
import './AiAssistantPage.css';
import ForecastUploader from '../components/ForecastUploader';

const AiAssistantPage = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: 'Здравствуйте! Я ваш AI-помощник по вопросам электроэнергии и тарифов. Чем я могу вам помочь сегодня?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForecastTool, setShowForecastTool] = useState(false);

  const handleForecastComplete = (data) => {
    // Add a message to the chat when forecast is completed
    const summaryMessage = {
      role: 'assistant',
      content: `Прогноз потребления электроэнергии успешно создан! 
      \nПрогноз на ${data.forecast.length} месяцев показывает среднее потребление ${
        (data.forecast.reduce((sum, item) => sum + item.prediction, 0) / data.forecast.length).toFixed(2)
      } единиц.
      \nВы можете изучить детальные результаты, графики и скачать данные в окне ниже.`
    };
    
    setChatHistory(prev => [...prev, summaryMessage]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Добавляем сообщение пользователя в историю
    const userMessage = { role: 'user', content: message };
    setChatHistory([...chatHistory, userMessage]);
    
    // Очищаем поле ввода
    setMessage('');
    
    // Имитируем загрузку ответа от AI
    setIsLoading(true);
    
    // Проверяем, запрашивает ли пользователь прогноз
    const userQuery = message.toLowerCase();
    const forecastKeywords = [
      'прогноз', 'предсказ', 'предиктивный', 
      'будущее потребление', 'спрогнозиру', 'forecast', 
      'предскаж', 'спрогноз', 'predict'
    ];
    
    const isForecastRequest = forecastKeywords.some(keyword => userQuery.includes(keyword));
    
    // Имитация задержки ответа
    setTimeout(() => {
      // Примеры ответов в зависимости от запроса пользователя
      let assistantResponse;
      
      if (isForecastRequest) {
        assistantResponse = {
          role: 'assistant',
          content: 'Я могу помочь вам с прогнозированием потребления электроэнергии на основе исторических данных. Для этого вам нужно загрузить CSV-файл с историей потребления по месяцам (колонки year, month, volume). Я подготовил инструмент для загрузки данных и создания прогноза ниже.'
        };
        setShowForecastTool(true);
      } else if (userQuery.includes('тариф') || userQuery.includes('цена') || userQuery.includes('стоимость')) {
        assistantResponse = {
          role: 'assistant',
          content: 'Тарифы на электроэнергию различаются в зависимости от региона и типа потребителя. В нашем сервисе вы можете рассчитать точную стоимость в разделе "Тарифный калькулятор". Для физических лиц обычно доступны одноставочный и многозонный тарифы. Для юридических лиц тарификация более сложная и учитывает множество факторов.'
        };
      } else if (userQuery.includes('счетчик') || userQuery.includes('прибор учета')) {
        assistantResponse = {
          role: 'assistant',
          content: 'Современные электросчетчики бывают однотарифными и многотарифными. Многотарифные счетчики позволяют учитывать потребление электроэнергии по зонам суток и могут помочь сэкономить, если большая часть потребления приходится на ночное время. Для замены или установки нового счетчика необходимо обратиться в энергосбытовую компанию вашего региона.'
        };
      } else if (userQuery.includes('экономия') || userQuery.includes('экономить')) {
        assistantResponse = {
          role: 'assistant',
          content: 'Для экономии электроэнергии рекомендую: 1) использовать энергосберегающие LED-лампы; 2) отключать неиспользуемые приборы от сети; 3) выбирать бытовую технику с высоким классом энергоэффективности (A, A+, A++); 4) при возможности, переходить на многотарифный учет с преимущественным использованием электроэнергии в ночное время; 5) использовать таймеры для автоматического отключения приборов.'
        };
      } else if (userQuery.includes('привет') || userQuery.includes('здравствуй')) {
        assistantResponse = {
          role: 'assistant',
          content: 'Здравствуйте! Рад вас видеть. Я готов ответить на ваши вопросы об электроэнергии, тарифах и услугах нашего сервиса. Чем могу помочь?'
        };
      } else if (userQuery.includes('прогноз') && !isForecastRequest) {
        assistantResponse = {
          role: 'assistant',
          content: 'Если вы интересуетесь прогнозом потребления электроэнергии, я могу помочь вам создать такой прогноз на основе исторических данных. Просто напишите "Сделать прогноз потребления" или "Создать прогноз", и я предоставлю вам инструмент для загрузки данных.'
        };
      } else {
        assistantResponse = {
          role: 'assistant',
          content: 'Спасибо за ваш вопрос. Я могу предоставить информацию о тарифах на электроэнергию, помочь с выбором оптимального тарифа, рассказать о способах экономии и дать рекомендации по энергоэффективности. Также я могу помочь вам с прогнозированием потребления электроэнергии. Если у вас есть более конкретный вопрос, пожалуйста, уточните его, и я постараюсь помочь.'
        };
      }
      
      // Добавляем ответ ассистента в историю
      setChatHistory(prevChat => [...prevChat, assistantResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="ai-assistant-page">
      <div className="container mt-5 pt-5">
        <h1 className="h-primary text-center">AI-помощник по электроэнергии</h1>
        <div className="section-divider"></div>
        
        <div className="assistant-description text-center mb-5">
          <p>
            Наш AI-помощник готов ответить на ваши вопросы о тарифах на электроэнергию,
            помочь с выбором оптимального тарифа и дать рекомендации по энергосбережению.
          </p>
        </div>
        
        <div className="chat-container">
          <div className="chat-messages">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message assistant">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {showForecastTool && (
            <div className="forecast-tool-container mt-4 mb-4">
              <ForecastUploader onForecastComplete={handleForecastComplete} />
            </div>
          )}
          
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Введите ваш вопрос..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
              />
              <div className="input-group-append">
                <button 
                  className="btn" 
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  title="Отправить сообщение"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 16 16" className="send-icon">
                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="assistant-features mt-5">
          <h2 className="h4 mb-4">Возможности AI-помощника</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
                  </svg>
                </div>
                <h3>Консультации по тарифам</h3>
                <p>
                  Помогаем разобраться в тарифах на электроэнергию,
                  объясняем различия между ними и подбираем оптимальный вариант.
                </p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6 5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V6H6.5a.5.5 0 0 1-.5-.5zM3 3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1zM3 12a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-1z"/>
                  </svg>
                </div>
                <h3>Расчет стоимости</h3>
                <p>
                  Предварительная оценка стоимости электроэнергии
                  для физических и юридических лиц с учетом различных факторов.
                </p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2z"/>
                  </svg>
                </div>
                <h3>Советы по энергосбережению</h3>
                <p>
                  Практические рекомендации, которые помогут
                  снизить потребление электроэнергии и сэкономить деньги.
                </p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"/>
                  </svg>
                </div>
                <h3>Прогнозирование потребления</h3>
                <p>
                  Создание прогнозов потребления электроэнергии
                  на основе исторических данных для планирования расходов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPage;