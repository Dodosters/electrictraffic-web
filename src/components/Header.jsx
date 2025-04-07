import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import './HeaderOverride.css'; // Добавляем стили с высоким приоритетом
import logo from '../assets/logo.png';

const Header = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  // Добавляем состояние для выпадающего меню
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  
  // Refs для отслеживания кликов вне выпадающего меню
  const dropdownRef = useRef(null);
  const dropdownToggleRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileDropdownToggleRef = useRef(null);
  
  const toggleNav = () => {
    setIsNavExpanded(!isNavExpanded);
  };

  const closeNav = () => {
    setIsNavExpanded(false);
    setIsDropdownOpen(false);
    setIsMobileDropdownOpen(false);
  };
  
  // Функция для переключения выпадающего меню
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Функция для переключения мобильного выпадающего меню
  const toggleMobileDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };
  
  // Обработчик для закрытия выпадающих меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Для десктопного меню
      if (dropdownRef.current && 
          dropdownToggleRef.current && 
          !dropdownRef.current.contains(event.target) &&
          !dropdownToggleRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      
      // Для мобильного меню
      if (mobileDropdownRef.current && 
          mobileDropdownToggleRef.current && 
          !mobileDropdownRef.current.contains(event.target) &&
          !mobileDropdownToggleRef.current.contains(event.target)) {
        setIsMobileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header>
      <nav className="navbar navbar-glass navbar-expand-md fixed-top">
        <div className="container-fluid glass main-nav"></div>
        <div className="container-sm d-flex justify-content-center">
          <Link className="navbar-brand d-md-none" to="/">
            <img style={{ width: '110px' }} src={logo} alt="Логотип ТНС" className="nav-logo" />
          </Link>
          <button className="navbar-toggler" type="button" onClick={toggleNav}>
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${isNavExpanded ? 'show' : ''}`}>
            <ul className="navbar-nav mx-auto align-items-center">
              <li className="nav-item logo-item d-none d-md-block">
                <Link className="navbar-brand" to="/">
                  <img style={{ width: '110px' }} src={logo} alt="Логотип ТНС" className="nav-logo" />
                </Link>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link primary-c px-3 ai-assistant-btn" to="/ai-assistant" onClick={closeNav}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16" className="me-1">
                    <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z"/>
                    <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z"/>
                  </svg>
                  <span className="ai-text">AI-помощник</span>
                </NavLink>
              </li>
            
              {/* Собственная реализация выпадающего меню */}
              <li className="nav-item dropdown" style={{ position: 'relative' }}>
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  onClick={toggleDropdown}
                  ref={dropdownToggleRef}
                  aria-expanded={isDropdownOpen}
                >
                  Тарифный калькулятор
                </a>
                {/* Используем состояние React для показа/скрытия меню */}
                <ul 
                  className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} 
                  ref={dropdownRef}
                  style={{ 
                    zIndex: 1000,
                    display: isDropdownOpen ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    left: 0
                  }}
                >
                  <li><Link className="dropdown-item" to="/ur" onClick={closeNav}>Для Компаний</Link></li>
                  <li><Link className="dropdown-item" to="/fiz" onClick={closeNav}>Для Физических лиц</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/hourly" onClick={closeNav}>Почасовое потребление</Link></li>
                </ul>
              </li>
              
              <li className="nav-item">
                <NavLink className="nav-link primary-c px-3" to="/analytics" onClick={closeNav}>Аналитика</NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink className="nav-link primary-c px-3" to="/data_api" onClick={closeNav}>Для партнеров</NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink className="nav-link primary-c px-3" to="/faq" onClick={closeNav}>FAQ</NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink className="nav-link primary-c px-3" to="/news" onClick={closeNav}>Новости</NavLink>
              </li>

              <li className="nav-item">
                <div className="telegram mx-2">
                  <a href="https://t.me/rostovenergy" target="_blank" rel="noreferrer">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.4167 30H16.5833C22.93 30 26.0917 30 28.0517 28.04C30 26.08 30 22.9067 30 16.5833V15.3933C30 9.09333 30 5.92 28.0517 3.96C26.0917 2 22.9183 2 16.5833 2H15.4167C9.07 2 5.90833 2 3.94833 3.96C2 5.92 2 9.09333 2 15.4167V16.6067C2 22.9067 2 26.08 3.96 28.04C5.92 30 9.09333 30 15.4167 30Z" fill="var(--bs-secondary)"></path>
                      <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white"></path>
                    </svg>
                  </a>
                </div>
              </li>
              <li className="nav-item">
                <div className="vk">
                  <a href="https://vk.com/rostovenergy" target="_blank" rel="noreferrer">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.4167 30H16.5833C22.93 30 26.0917 30 28.0517 28.04C30 26.08 30 22.9067 30 16.5833V15.3933C30 9.09333 30 5.92 28.0517 3.96C26.0917 2 22.9183 2 16.5833 2H15.4167C9.07 2 5.90833 2 3.94833 3.96C2 5.92 2 9.09333 2 15.4167V16.6067C2 22.9067 2 26.08 3.96 28.04C5.92 30 9.09333 30 15.4167 30Z" fill="var(--bs-secondary)"></path>
                      <path d="M16.8039 22C10.654 22 7.14616 17.8709 7 11H10.0806C10.1818 16.043 12.4528 18.1792 14.2517 18.6196V11H17.1524V15.3493C18.9288 15.1622 20.7951 13.1802 21.4247 11H24.3254C24.0882 12.1307 23.6152 13.2013 22.9362 14.1448C22.2572 15.0883 21.3867 15.8845 20.3791 16.4835C21.5038 17.0308 22.4972 17.8055 23.2937 18.7564C24.0902 19.7073 24.6718 20.8128 25 22H21.807C21.5124 20.9688 20.9135 20.0458 20.0855 19.3465C19.2575 18.6472 18.2372 18.2029 17.1524 18.0691V22H16.8039Z" fill="white"></path>
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>

          <div className={`offcanvas offcanvas-end glass offcanvas-navbar d-md-none ${isNavExpanded ? 'show' : ''}`}>
            <div className="offcanvas-header">
              <img width="110" style={{ width: '110px' }} src={logo} alt="Логотип ТНС" className="nav-logo mx-auto" />
              <button type="button" className="btn-close btn-close-dark" onClick={closeNav}></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item my-1">
                  <NavLink className="nav-link primary-c px-3 ai-assistant-btn" to="/ai-assistant" onClick={closeNav}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16" className="me-1">
                      <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5ZM3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.58 26.58 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.933.933 0 0 1-.765.935c-.845.147-2.34.346-4.235.346-1.895 0-3.39-.2-4.235-.346A.933.933 0 0 1 3 9.219V8.062Zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a24.767 24.767 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25.286 25.286 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135Z"/>
                      <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2V1.866ZM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5Z"/>
                    </svg>
                    <span className="ai-text">AI-помощник</span>
                  </NavLink>
                </li>
                
                {/* Собственная реализация мобильного выпадающего меню */}
                <li className="nav-item dropdown" style={{ position: 'relative' }}>
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    onClick={toggleMobileDropdown}
                    ref={mobileDropdownToggleRef}
                    aria-expanded={isMobileDropdownOpen}
                  >
                    Тарифный калькулятор
                  </a>
                  {/* Используем состояние React для показа/скрытия меню */}
                  <ul 
                    className={`dropdown-menu ${isMobileDropdownOpen ? 'show' : ''}`} 
                    ref={mobileDropdownRef}
                    style={{ 
                      zIndex: 1000,
                      display: isMobileDropdownOpen ? 'block' : 'none',
                      position: 'static',
                      float: 'none'
                    }}
                  >
                    <li><Link className="dropdown-item" to="/ur" onClick={closeNav}>Для Компаний</Link></li>
                    <li><Link className="dropdown-item" to="/fiz" onClick={closeNav}>Для Физических лиц</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/hourly" onClick={closeNav}>Почасовое потребление</Link></li>
                  </ul>
                </li>
                
                <li className="nav-item my-1">
                  <NavLink className="nav-link primary-c px-3" to="/analytics" onClick={closeNav}>Аналитика</NavLink>
                </li>
                
                <li className="nav-item my-1">
                  <NavLink className="nav-link primary-c px-3" to="/data_api" onClick={closeNav}>Для партнеров</NavLink>
                </li>
                
                <li className="nav-item my-1">
                  <NavLink className="nav-link primary-c px-3" to="/faq" onClick={closeNav}>FAQ</NavLink>
                </li>
                
                <li className="nav-item my-1">
                  <NavLink className="nav-link primary-c px-3" to="/news" onClick={closeNav}>Новости</NavLink>
                </li>
              </ul>
              <div className="w-auto nav socials d-flex flex-row align-items-center">
                <div className="telegram mx-2">
                  <a href="https://t.me/rostovenergy" target="_blank" rel="noreferrer">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.4167 30H16.5833C22.93 30 26.0917 30 28.0517 28.04C30 26.08 30 22.9067 30 16.5833V15.3933C30 9.09333 30 5.92 28.0517 3.96C26.0917 2 22.9183 2 16.5833 2H15.4167C9.07 2 5.90833 2 3.94833 3.96C2 5.92 2 9.09333 2 15.4167V16.6067C2 22.9067 2 26.08 3.96 28.04C5.92 30 9.09333 30 15.4167 30Z" fill="var(--bs-secondary)"></path>
                      <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white"></path>
                    </svg>
                  </a>
                </div>
                <div className="vk">
                  <a href="https://vk.com/rostovenergy" target="_blank" rel="noreferrer">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.4167 30H16.5833C22.93 30 26.0917 30 28.0517 28.04C30 26.08 30 22.9067 30 16.5833V15.3933C30 9.09333 30 5.92 28.0517 3.96C26.0917 2 22.9183 2 16.5833 2H15.4167C9.07 2 5.90833 2 3.94833 3.96C2 5.92 2 9.09333 2 15.4167V16.6067C2 22.9067 2 26.08 3.96 28.04C5.92 30 9.09333 30 15.4167 30Z" fill="var(--bs-secondary)"></path>
                      <path d="M16.8039 22C10.654 22 7.14616 17.8709 7 11H10.0806C10.1818 16.043 12.4528 18.1792 14.2517 18.6196V11H17.1524V15.3493C18.9288 15.1622 20.7951 13.1802 21.4247 11H24.3254C24.0882 12.1307 23.6152 13.2013 22.9362 14.1448C22.2572 15.0883 21.3867 15.8845 20.3791 16.4835C21.5038 17.0308 22.4972 17.8055 23.2937 18.7564C24.0902 19.7073 24.6718 20.8128 25 22H21.807C21.5124 20.9688 20.9135 20.0458 20.0855 19.3465C19.2575 18.6472 18.2372 18.2029 17.1524 18.0691V22H16.8039Z" fill="white"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
