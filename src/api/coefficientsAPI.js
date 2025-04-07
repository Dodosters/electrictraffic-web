const API_URL = 'http://193.33.153.200';

// Helper function to ensure all numeric values are properly typed
const formatCoefficientsData = (data) => {
  // Creates a deep copy with proper number formatting
  const processObject = (obj) => {
    if (obj === null || typeof obj !== 'object') {
      // If it's a primitive value, convert to number if it's numeric
      return typeof obj === 'string' && !isNaN(parseFloat(obj)) ? parseFloat(obj) : obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => processObject(item));
    }

    // Handle objects
    const result = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = processObject(obj[key]);
      }
    }
    return result;
  };

  return processObject(data);
};

// Fetch all coefficients
export const getAllCoefficients = async () => {
  try {
    const response = await fetch(`${API_URL}/get_coefficients`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all coefficients:', error);
    throw error;
  }
};

// Fetch first category coefficients
export const getFirstCategoryCoefficients = async () => {
  try {
    const response = await fetch(`${API_URL}/get_coefficients/first_category`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching first category coefficients:', error);
    throw error;
  }
};

// Update first category coefficients
export const updateFirstCategoryCoefficients = async (data) => {
  try {
    // Format data to ensure all numeric values are properly typed
    const formattedData = formatCoefficientsData(data);
    
    console.log('Sending first category data:', JSON.stringify(formattedData, null, 2));
    
    const response = await fetch(`${API_URL}/coefficients/first_category`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating first category coefficients:', error);
    throw error;
  }
};

// Fetch second category coefficients
export const getSecondCategoryCoefficients = async () => {
  try {
    const response = await fetch(`${API_URL}/get_coefficients/second_category`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching second category coefficients:', error);
    throw error;
  }
};

// Update second category coefficients
export const updateSecondCategoryCoefficients = async (data) => {
  try {
    // Format data to ensure all numeric values are properly typed
    const formattedData = formatCoefficientsData(data);
    
    console.log('Sending second category data:', JSON.stringify(formattedData, null, 2));
    
    const response = await fetch(`${API_URL}/coefficients/second_category`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating second category coefficients:', error);
    throw error;
  }
};

// Fetch third category coefficients
export const getThirdCategoryCoefficients = async () => {
  try {
    const response = await fetch(`${API_URL}/get_coefficients/third_category`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching third category coefficients:', error);
    throw error;
  }
};

// Update third category coefficients
export const updateThirdCategoryCoefficients = async (data) => {
  try {
    // Format data to ensure all numeric values are properly typed
    const formattedData = formatCoefficientsData(data);
    
    console.log('Sending third category data:', JSON.stringify(formattedData, null, 2));
    
    const response = await fetch(`${API_URL}/coefficients/third_category`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating third category coefficients:', error);
    throw error;
  }
};

// Fetch fourth category coefficients
export const getFourthCategoryCoefficients = async () => {
  try {
    const response = await fetch(`${API_URL}/get_coefficients/four_category`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching fourth category coefficients:', error);
    throw error;
  }
};

// Update fourth category coefficients
export const updateFourthCategoryCoefficients = async (data) => {
  try {
    // Format data to ensure all numeric values are properly typed
    const formattedData = formatCoefficientsData(data);
    
    console.log('Sending fourth category data:', JSON.stringify(formattedData, null, 2));
    
    const response = await fetch(`${API_URL}/coefficients/four_category`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating fourth category coefficients:', error);
    throw error;
  }
};