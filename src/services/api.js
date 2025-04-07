// ТНС-энерго API service connecting to the FastAPI backend

// Base URL for the API
const API_BASE_URL = 'http://193.33.153.200';

// API endpoints
export const api = {
  // Business tariffs
  getBusinessTariffs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_business-tariffs`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching business tariffs:', error);
      return { success: false, error: 'Failed to fetch business tariffs' };
    }
  },
  
  getBusinessTariffsByRegion: async (region) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_business-tariffs/${encodeURIComponent(region)}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching business tariffs for region ${region}:`, error);
      return { success: false, error: `Failed to fetch business tariffs for region ${region}` };
    }
  },
  
  // Personal tariffs
  getPersonalTariffs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_personal-tariffs`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching personal tariffs:', error);
      return { success: false, error: 'Failed to fetch personal tariffs' };
    }
  },
  
  getPersonalTariffsByRegion: async (region) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_personal-tariffs/${encodeURIComponent(region)}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching personal tariffs for region ${region}:`, error);
      return { success: false, error: `Failed to fetch personal tariffs for region ${region}` };
    }
  },
  
  // Energy providers
  getProviders: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_providers`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching providers:', error);
      return { success: false, error: 'Failed to fetch providers' };
    }
  },
  
  getProviderById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_providers/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching provider with ID ${id}:`, error);
      return { success: false, error: `Failed to fetch provider with ID ${id}` };
    }
  },
  
  // Analytics
  getAnalyticsData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_analytics`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      return { success: false, error: 'Failed to fetch analytics data' };
    }
  },
  
  // Calculator functions
  calculateBusinessElectricityCost: async (params) => {
    try {
      // Ensure all required parameters are provided according to CalculateBusinessRequest model
      const requestBody = {
        region: params.region,
        consumption: params.consumption,
        power_tarif: params.power_tarif,
        day_consumption: params.day_consumption,
        night_consumption: params.night_consumption,
        cost_of_energy: params.cost_of_energy,
        real_volume: params.real_volume,
        real_average_power: params.real_average_power,
        real_average_power_broadcast: params.real_average_power_broadcast
      };
      
      console.log('Sending calculation request with params:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/get_calculate/business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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
  
  // Process Excel file using the /process-excel endpoint
  processExcelFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/process-excel`, {
        method: 'POST',
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error processing Excel file:', error);
      return { 
        success: false, 
        error: 'Error processing Excel file: ' + error.message 
      };
    }
  },
  
  // FAQ endpoints
  getFAQs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_faqs`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return { success: false, error: 'Failed to fetch FAQs' };
    }
  },
  
  // News endpoints
  getNews: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_news`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching news:', error);
      return { success: false, error: 'Failed to fetch news' };
    }
  },
  
  getNewsById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_news/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching news with ID ${id}:`, error);
      return { success: false, error: `Failed to fetch news with ID ${id}` };
    }
  },
  
  // Submit question
  submitQuestion: async (questionData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/submit-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error submitting question:', error);
      return { success: false, error: 'Failed to submit question' };
    }
  },

  // Get chart data from Excel file
  getChartData: async (file, viewType = 'hourly') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/chart-data?view_type=${viewType}`, {
        method: 'POST',
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error processing chart data:', error);
      return { 
        success: false, 
        error: 'Error processing chart data: ' + error.message 
      };
    }
  },
  
  // Get weekday profile data from Excel file
  getWeekdayProfile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_BASE_URL}/weekday-profile`, {
        method: 'POST',
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error processing weekday profile data:', error);
      return { 
        success: false, 
        error: 'Error processing weekday profile data: ' + error.message 
      };
    }
  }
};