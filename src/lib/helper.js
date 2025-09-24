/**
 * Helper functions for handling API responses and error messages
 */

/**
 * Extract error message from various error response formats
 * Optimized for Laravel BaseApiController response structure
 * @param {Object} error - The error object from axios or API
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  // If error is a string, return it directly
  if (typeof error === 'string') {
    return error;
  }

  // If error is null or undefined
  if (!error) {
    return 'An unknown error occurred';
  }

  // Check for axios error structure
  if (error.response) {
    // Server responded with error status
    const { data, status } = error.response;

    // Try to extract message from response data
    if (data) {
      // Laravel BaseApiController structure - check for message first
      if (data.message) return data.message;

      // Check for other common message fields
      if (data.error) return data.error;
      if (data.detail) return data.detail;
      if (data.msg) return data.msg;

      // Laravel validation errors structure
      if (data.errors) {
        if (Array.isArray(data.errors)) {
          return data.errors.map((err) => err.message || err).join(', ');
        }
        if (typeof data.errors === 'object') {
          // Laravel validation errors are typically objects with field keys
          const errorMessages = [];
          Object.keys(data.errors).forEach((field) => {
            const fieldErrors = data.errors[field];
            if (Array.isArray(fieldErrors)) {
              errorMessages.push(...fieldErrors);
            } else {
              errorMessages.push(fieldErrors);
            }
          });
          return errorMessages.join(', ');
        }
      }

      // If data is a string
      if (typeof data === 'string') {
        return data;
      }
    }

    // Fallback to status-based messages
    return getStatusMessage(status);
  }

  // Check for network errors
  if (error.request) {
    return 'Network error. Please check your connection and try again.';
  }

  // Check for axios error message
  if (error.message) {
    // Clean up axios error messages
    if (error.message.includes('Network Error')) {
      return 'Network error. Please check your connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timeout. Please try again.';
    }
    if (error.message.includes('Request failed with status code')) {
      const statusCode = error.message.match(/\d+/)?.[0];
      return getStatusMessage(parseInt(statusCode));
    }
    return error.message;
  }

  // Last resort
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Get user-friendly message based on HTTP status code
 * @param {number} status - HTTP status code
 * @returns {string} - User-friendly message
 */
export const getStatusMessage = (status) => {
  const statusMessages = {
    400: 'Bad request. Please check your input and try again.',
    401: 'Authentication required. Please log in.',
    403: "Access denied. You don't have permission to perform this action.",
    404: 'The requested resource was not found.',
    405: 'Method not allowed.',
    408: 'Request timeout. Please try again.',
    409: "Conflict. The resource already exists or there's a conflict.",
    422: 'Validation error. Please check your input.',
    429: 'Too many requests. Please wait and try again.',
    500: 'Internal server error. Please try again later.',
    502: 'Bad gateway. The server is temporarily unavailable.',
    503: 'Service unavailable. Please try again later.',
    504: 'Gateway timeout. Please try again later.',
  };

  return statusMessages[status] || `Request failed with status ${status}`;
};

/**
 * Extract success message from API response
 * Optimized for Laravel BaseApiController response structure
 * @param {Object} response - API response object
 * @returns {string|null} - Success message or null
 */
export const getSuccessMessage = (response) => {
  if (!response) return null;

  // For axios responses, check response.data first (Laravel BaseApiController structure)
  if (response.data && typeof response.data === 'object') {
    if (response.data.message) return response.data.message;
    if (response.data.success_message) return response.data.success_message;
    if (response.data.msg) return response.data.msg;
  }

  // Check for direct message (if response is already the data object)
  if (response.message) return response.message;
  if (response.success_message) return response.success_message;
  if (response.msg) return response.msg;

  return null;
};

/**
 * Extract data from API response
 * Optimized for Laravel BaseApiController response structure
 * @param {Object} response - API response object
 * @returns {any} - Extracted data
 */
export const getResponseData = (response) => {
  if (!response) return null;

  // For axios responses, the actual API response is in response.data
  if (response.data !== undefined) {
    // Laravel BaseApiController structure: { success: true, message: '', data: {...} }
    if (typeof response.data === 'object' && response.data.data !== undefined) {
      return response.data.data; // Return the nested data property
    }
    return response.data; // Return the entire response.data
  }

  // If response is already the data object (direct API response)
  if (response.data !== undefined) {
    return response.data;
  }

  // Otherwise return the response itself
  return response;
};

/**
 * Check if error is a specific type
 * @param {Object} error - Error object
 * @param {number} statusCode - HTTP status code to check
 * @returns {boolean} - Whether error matches the status code
 */
export const isErrorStatus = (error, statusCode) => {
  return error?.response?.status === statusCode || error?.status === statusCode;
};

/**
 * Check if error is authentication related
 * @param {Object} error - Error object
 * @returns {boolean} - Whether error is auth related
 */
export const isAuthError = (error) => {
  return isErrorStatus(error, 401) || isErrorStatus(error, 403);
};

/**
 * Check if error is validation related
 * @param {Object} error - Error object
 * @returns {boolean} - Whether error is validation related
 */
export const isValidationError = (error) => {
  return isErrorStatus(error, 422) || isErrorStatus(error, 400);
};

/**
 * Check if error is network related
 * @param {Object} error - Error object
 * @returns {boolean} - Whether error is network related
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Format validation errors for display
 * Optimized for Laravel BaseApiController validation error structure
 * @param {Object} error - Error object with validation errors
 * @returns {Object} - Formatted validation errors
 */
export const formatValidationErrors = (error) => {
  const errors = {};

  if (error?.response?.data?.errors) {
    const validationErrors = error.response.data.errors;

    if (Array.isArray(validationErrors)) {
      // Handle array of error objects
      validationErrors.forEach((err) => {
        if (err.field && err.message) {
          errors[err.field] = err.message;
        }
      });
    } else if (typeof validationErrors === 'object') {
      // Laravel validation errors: { field: ['error1', 'error2'] }
      Object.keys(validationErrors).forEach((field) => {
        const fieldErrors = validationErrors[field];
        if (Array.isArray(fieldErrors)) {
          errors[field] = fieldErrors[0]; // Take first error
        } else {
          errors[field] = fieldErrors;
        }
      });
    }
  }

  return errors;
};

/**
 * Check if API response indicates success
 * Based on Laravel BaseApiController response structure
 * @param {Object} response - API response object
 * @returns {boolean} - Whether the response indicates success
 */
export const isApiSuccess = (response) => {
  if (!response) return false;

  // For axios responses, check response.data.success
  if (response.data && typeof response.data === 'object') {
    // Check for explicit success flag first
    if (response.data.success !== undefined) {
      return response.data.success === true;
    }

    // Check for presence of data property as success indicator
    if (response.data.data !== undefined) {
      return true;
    }
  }

  // If response is already the data object
  if (response.success !== undefined) {
    return response.success === true;
  }

  // Fallback: check status code
  if (response.status) {
    return response.status >= 200 && response.status < 300;
  }

  // If no other indicators, assume success if response exists
  return true;
};

/**
 * Extract pagination data from Laravel BaseApiController paginated response
 * @param {Object} response - API response object
 * @returns {Object|null} - Pagination data or null
 */
export const getPaginationData = (response) => {
  if (!response) return null;

  // For axios responses, check response.data.pagination
  if (response.data && response.data.pagination) {
    return response.data.pagination;
  }

  // If response is already the data object
  if (response.pagination) {
    return response.pagination;
  }

  return null;
};

/**
 * Extract meta data from Laravel BaseApiController response
 * @param {Object} response - API response object
 * @returns {Object|null} - Meta data or null
 */
export const getMetaData = (response) => {
  if (!response) return null;

  // For axios responses, check response.data.meta
  if (response.data && response.data.meta) {
    return response.data.meta;
  }

  // If response is already the data object
  if (response.meta) {
    return response.meta;
  }

  return null;
};

/**
 * Create a standardized API response handler
 * @param {Promise} apiCall - The API call promise
 * @returns {Object} - Standardized response object
 */
export const handleApiResponse = async (apiCall) => {
  try {
    const response = await apiCall;
    return {
      success: true,
      data: getResponseData(response),
      message: getSuccessMessage(response),
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: null,
      error: getErrorMessage(error),
      validationErrors: isValidationError(error)
        ? formatValidationErrors(error)
        : null,
      isAuthError: isAuthError(error),
      isNetworkError: isNetworkError(error),
    };
  }
};

/**
 * Debounce function for API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(
    new Date(date)
  );
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} - Random string
 */
export const generateRandomString = (length = 10) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Sleep function for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
