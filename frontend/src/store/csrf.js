import Cookies from 'js-cookie';

/**
 * Perform an HTTP request with optional CSRF token inclusion.
 *
 * @param {string} url - The URL to make the request to.
 * @param {Object} options - The request options (e.g., method, headers, body).
 * @returns {Promise<Response>} - A promise that resolves with the response.
 */
export async function csrfFetch(url, options = {}) {
  // Set options.method to 'GET' if not provided
  options.method = options.method || 'GET';

  // Set options.headers to an empty object if not provided
  options.headers = options.headers || {};

  // Include CSRF token in headers for non-GET requests
  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    options.headers['X-XSRF-Token'] = Cookies.get('XSRF-TOKEN');
  }

  try {
    const response = await fetch(url, options);

    if (response.status >= 400) {
      // Handle error responses here, e.g., throw a custom error
      throw new Error('Request failed with status ' + response.status);
    }

    return response;
  } catch (error) {
    // Handle network errors or other exceptions
    throw new Error('Network error: ' + error.message);
  }
}

/**
 * Retrieve the CSRF token from the server.
 *
 * @returns {Promise<Response>} - A promise that resolves with the response.
 */
export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}
