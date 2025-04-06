import React, { useState } from 'react';
import FirstCategoryTab from './tabs/FirstCategoryTab';
import SecondCategoryTab from './tabs/SecondCategoryTab';
import ThirdCategoryTab from './tabs/ThirdCategoryTab';
import FourthCategoryTab from './tabs/FourthCategoryTab';

function TabPanel({ children, value, index }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
    >
      {value === index && (
        <div className="p-3">
          {children}
        </div>
      )}
    </div>
  );
}

const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (index) => {
    setTabValue(index);
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title mb-4">Админ-панель управления коэффициентами</h1>
          
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${tabValue === 0 ? 'active' : ''}`} 
                onClick={() => handleTabChange(0)}
                id="first-tab"
                type="button"
                role="tab"
                aria-controls="first-panel"
                aria-selected={tabValue === 0}
              >
                Первая категория
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${tabValue === 1 ? 'active' : ''}`} 
                onClick={() => handleTabChange(1)}
                id="second-tab"
                type="button"
                role="tab"
                aria-controls="second-panel"
                aria-selected={tabValue === 1}
              >
                Вторая категория
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${tabValue === 2 ? 'active' : ''}`} 
                onClick={() => handleTabChange(2)}
                id="third-tab"
                type="button"
                role="tab"
                aria-controls="third-panel"
                aria-selected={tabValue === 2}
              >
                Третья категория
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${tabValue === 3 ? 'active' : ''}`} 
                onClick={() => handleTabChange(3)}
                id="fourth-tab"
                type="button"
                role="tab"
                aria-controls="fourth-panel"
                aria-selected={tabValue === 3}
              >
                Четвертая категория
              </button>
            </li>
          </ul>
          
          <div className="tab-content">
            <TabPanel value={tabValue} index={0}>
              <FirstCategoryTab />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <SecondCategoryTab />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <ThirdCategoryTab />
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <FourthCategoryTab />
            </TabPanel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;