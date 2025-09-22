import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlistService';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [user, token]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      if (response.success) {
        setWishlistItems(response.data);
        setWishlistCount(response.count);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    try {
      const response = await wishlistService.addToWishlist(product._id);
      if (response.success) {
        setWishlistItems(response.data);
        setWishlistCount(response.count);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await wishlistService.removeFromWishlist(productId);
      if (response.success) {
        setWishlistItems(response.data);
        setWishlistCount(response.count);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const openWishlistModal = () => setIsModalOpen(true);
  const closeWishlistModal = () => setIsModalOpen(false);

  const value = {
    wishlistItems,
    wishlistCount,
    loading,
    isModalOpen,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchWishlist,
    openWishlistModal,
    closeWishlistModal
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};