import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="py-4 bg-light-gray">
      <div className="container-sm py-4">
        <div className="row border-bottom p-2 pt-4">
          <ul className="nav justify-content-center pb-3 mb-1">
            <li className="nav-item">
              <Link className="nav-link primary-c px-2 py-1" to="/">Главная</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link primary-c px-2 py-1" to="/analytics">Аналитика</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link primary-c px-2 py-1" to="/data_api">Для партнеров</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link primary-c px-2 py-1" to="/companies">Компании-поставщики</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link primary-c px-2 py-1" to="/faq">FAQ</Link>
            </li>
            
            <li className="nav-item">
              <Link className="nav-link primary-c px-2 py-1" to="/news">Новости</Link>
            </li>
          </ul>
        </div>
        <div className="row d-flex pt-4 justify-content-center align-items-center">
          <p className="col-md-4 mb-0 text-muted w-auto me-md-auto">© {new Date().getFullYear()} Etarif.ru</p>
          <div className="col-md-4 d-flex align-items-center justify-content-center">
            <a href="#" className="w-auto mb-3 mb-md-0 link-dark text-decoration-none policity">Политика конфиденциальности</a>
          </div>
          <div className="col-md-4 d-flex justify-content-center justify-content-md-end align-items-center">
            <div className="w-auto nav justify-content-end socials d-flex flex-row align-items-center">
              <div className="telegram mx-2">
                <a href="https://t.me/etarif" target="_blank" rel="noreferrer">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.4167 30H16.5833C22.93 30 26.0917 30 28.0517 28.04C30 26.08 30 22.9067 30 16.5833V15.3933C30 9.09333 30 5.92 28.0517 3.96C26.0917 2 22.9183 2 16.5833 2H15.4167C9.07 2 5.90833 2 3.94833 3.96C2 5.92 2 9.09333 2 15.4167V16.6067C2 22.9067 2 26.08 3.96 28.04C5.92 30 9.09333 30 15.4167 30Z" fill="var(--bs-secondary)"></path>
                    <path d="M22.9866 10.2088C23.1112 9.40332 22.3454 8.76755 21.6292 9.082L7.36482 15.3448C6.85123 15.5703 6.8888 16.3483 7.42147 16.5179L10.3631 17.4547C10.9246 17.6335 11.5325 17.541 12.0228 17.2023L18.655 12.6203C18.855 12.4821 19.073 12.7665 18.9021 12.9426L14.1281 17.8646C13.665 18.3421 13.7569 19.1512 14.314 19.5005L19.659 22.8523C20.2585 23.2282 21.0297 22.8506 21.1418 22.1261L22.9866 10.2088Z" fill="white"></path>
                  </svg>
                </a>
              </div>
              <div className="vk">
                <a href="https://vk.com/club217230014" target="_blank" rel="noreferrer">
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
    </footer>
  );
};

export default Footer;
