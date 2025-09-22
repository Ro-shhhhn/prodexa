import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class WishlistService {
  getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getWishlist() {
    try {
      const response = await axios.get(`${API_URL}/wishlist`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async addToWishlist(productId) {
    try {
      const response = await axios.post(
        `${API_URL}/wishlist/add`,
        { productId },
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async removeFromWishlist(productId) {
    try {
      const response = await axios.delete(
        `${API_URL}/wishlist/remove/${productId}`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async checkWishlistItem(productId) {
    try {
      const response = await axios.get(
        `${API_URL}/wishlist/check/${productId}`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export default new WishlistService();