const API_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      const data = await response.json();

      if (response.status === 401) {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/signup') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
        }
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error');
    }
  }


  // GET request
  async get(endpoint) {
    return this.request(endpoint);
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export default new ApiService();