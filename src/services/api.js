// ETariff API service connecting to the FastAPI backend

// Base URL for the API
const API_BASE_URL = 'http://localhost:8000';

// API endpoints
export const api = {
  // Business tariffs
  getBusinessTariffs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/business-tariffs`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching business tariffs:', error);
      return { success: false, error: 'Failed to fetch business tariffs' };
    }
  },
  
  getBusinessTariffsByRegion: async (region) => {
    try {
      const response = await fetch(`${API_BASE_URL}/business-tariffs/${encodeURIComponent(region)}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching business tariffs for region ${region}:`, error);
      return { success: false, error: `Failed to fetch business tariffs for region ${region}` };
    }
  },
  
  // Personal tariffs
  getPersonalTariffs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/personal-tariffs`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching personal tariffs:', error);
      return { success: false, error: 'Failed to fetch personal tariffs' };
    }
  },
  
  getPersonalTariffsByRegion: async (region) => {
    try {
      const response = await fetch(`${API_BASE_URL}/personal-tariffs/${encodeURIComponent(region)}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching personal tariffs for region ${region}:`, error);
      return { success: false, error: `Failed to fetch personal tariffs for region ${region}` };
    }
  },
  
  // Energy providers
  getProviders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching providers:', error);
      return { success: false, error: 'Failed to fetch providers' };
    }
  },
  
  getProviderById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/providers/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching provider with ID ${id}:`, error);
      return { success: false, error: `Failed to fetch provider with ID ${id}` };
    }
  },
  
  // Analytics
  getAnalyticsData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      return { success: false, error: 'Failed to fetch analytics data' };
    }
  },
  
  // Calculator functions
  calculateBusinessElectricityCost: async (params) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calculate/business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      return await response.json();
    } catch (error) {
      console.error('Error calculating business electricity cost:', error);
      return { success: false, error: 'Failed to calculate business electricity cost' };
    }
  },
  
  calculatePersonalElectricityCost: async (params) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calculate/personal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      return await response.json();
    } catch (error) {
      console.error('Error calculating personal electricity cost:', error);
      return { success: false, error: 'Failed to calculate personal electricity cost' };
    }
  },
  
  // Process hourly consumption via uploaded file
  processHourlyConsumption: async (csvData, region = 'Ростов-на-Дону') => {
    try {
      // Converting string data to CSV file for upload
      const blob = new Blob([csvData], { type: 'text/csv' });
      const file = new File([blob], 'consumption_data.csv');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('region', region);
      
      const response = await fetch(`${API_BASE_URL}/process-hourly-consumption`, {
        method: 'POST',
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error processing hourly consumption data:', error);
      return { 
        success: false, 
        error: 'Error processing hourly consumption data: ' + error.message 
      };
    }
  },
  
  // Alternative method that sends CSV as string in JSON payload
  processHourlyConsumptionString: async (csvData, region = 'Ростов-на-Дону') => {
    try {
      const response = await fetch(`${API_BASE_URL}/process-hourly-consumption-string`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csvData,
          region
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error processing hourly consumption data:', error);
      return { 
        success: false, 
        error: 'Error processing hourly consumption data: ' + error.message 
      };
    }
  },
  
  // FAQ endpoints
  getFAQs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/faqs`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return { success: false, error: 'Failed to fetch FAQs' };
    }
  },
  
  // News endpoints
  getNews: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      return { success: false, error: 'Failed to fetch news' };
    }
  },
  
  getNewsById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching news with ID ${id}:`, error);
      return { success: false, error: `Failed to fetch news with ID ${id}` };
    }
  }
};
