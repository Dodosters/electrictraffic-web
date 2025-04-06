/**
 * Updates a nested object property by path
 * 
 * @param {Object} object - The object to update
 * @param {string} path - The path to the property (dot notation)
 * @param {any} value - The new value
 * @returns {Object} - A new object with the updated property
 */
export const setNestedProperty = (object, path, value) => {
  if (!object || typeof object !== 'object') return object;
  
  const pathArray = Array.isArray(path) ? path : path.split('.');
  const newObj = { ...object };
  
  let current = newObj;
  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i];
    current[key] = { ...current[key] };
    current = current[key];
  }
  
  current[pathArray[pathArray.length - 1]] = value;
  
  return newObj;
};

/**
 * Gets a nested object property by path
 * 
 * @param {Object} object - The object to get the property from
 * @param {string} path - The path to the property (dot notation)
 * @returns {any} - The property value or undefined if not found
 */
export const getNestedProperty = (object, path) => {
  if (!object || typeof object !== 'object') return undefined;
  
  const pathArray = Array.isArray(path) ? path : path.split('.');
  let current = object;
  
  for (let i = 0; i < pathArray.length; i++) {
    if (current === undefined || current === null) return undefined;
    current = current[pathArray[i]];
  }
  
  return current;
};

/**
 * Formats a camelCase or snake_case string to Title Case
 * 
 * @param {string} str - The string to format
 * @returns {string} - The formatted string
 */
export const formatFieldName = (str) => {
  if (!str) return '';
  
  // Replace snake_case with spaces
  let formatted = str.replace(/_/g, ' ');
  
  // Replace camelCase with spaces before uppercase letters
  formatted = formatted.replace(/([A-Z])/g, ' $1');
  
  // Capitalize first letter of each word
  formatted = formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return formatted;
};
