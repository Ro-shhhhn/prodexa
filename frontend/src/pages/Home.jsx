// src/pages/Home.jsx
import React, { useState, useCallback } from 'react';
import Layout from '../components/common/Layout/Layout';
import ProductGrid from '../components/Product/ProductGrid';
import Pagination from '../components/common/UI/Pagination';
import Button from '../components/common/UI/Button';
import Modal from '../components/common/UI/Modal';
import ProductForm from '../components/Product/ProductForm';
import CategoryForm from '../components/Category/CategoryForm';
import SubCategoryForm from '../components/Category/SubCategoryForm';
import { useProduct } from '../context/ProductContext';

const Home = () => {
  const {
    products,
    loading,
    initialized,
    filters,
    pagination,
    updateFilters,
    updatePage,
    fetchProducts
  } = useProduct();

  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);
  
  // Success toast state
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Show success toast
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleSearch = useCallback((term) => {
    updateFilters({ search: term });
  }, [updateFilters]);

  const handleCategoryFilter = useCallback((category) => {
    updateFilters({ 
      category: category, 
      subcategories: [] // Reset subcategories when category changes
    });
  }, [updateFilters]);

  const handleSubCategoryFilter = useCallback((subCategories) => {
    updateFilters({ subcategories: subCategories });
  }, [updateFilters]);

  const handlePageChange = (page) => {
    updatePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newLimit) => {
    updateFilters({ limit: newLimit });
  };

  const handleAddToWishlist = async (product) => {
    try {
      console.log('Added to wishlist:', product.name);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const handleViewDetails = (product) => {
    console.log('View details:', product.name);
  };

  const handleOpenWishlist = () => {
    console.log('Open wishlist');
  };

  const handleProductSuccess = async (newProduct) => {
    setShowAddProductModal(false);
    showSuccess('Product added successfully!');
    
    // Refresh products list
    setTimeout(() => {
      fetchProducts();
    }, 500);
  };

  const handleCategorySuccess = async (newCategory) => {
    setShowAddCategoryModal(false);
    showSuccess('Category added successfully!');
    setTimeout(() => {
      fetchProducts();
    }, 500);
  };

  const handleSubCategorySuccess = async (newSubCategory) => {
    setShowAddSubCategoryModal(false);
    showSuccess('Sub category added successfully!');
    setTimeout(() => {
      fetchProducts();
    }, 500);
  };

  if (!initialized && loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Get display title based on filters
  const getDisplayTitle = () => {
    if (filters.search) {
      return `Search results for "${filters.search}"`;
    }
    if (filters.category) {
      let title = filters.category.name;
      if (filters.subcategories && filters.subcategories.length > 0) {
        const subNames = filters.subcategories.map(sub => sub.name).join(', ');
        title += ` - ${subNames}`;
      }
      return title;
    }
    return 'All Products';
  };

  return (
    <Layout
      onSearch={handleSearch}
      onOpenWishlist={handleOpenWishlist}
      onCategoryFilter={handleCategoryFilter}
      onSubCategoryFilter={handleSubCategoryFilter}
      selectedCategory={filters.category}
      selectedSubCategories={filters.subcategories}
    >
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getDisplayTitle()}
          </h1>
        </div>

        <div className="flex space-x-3">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddCategoryModal(true)}
            className="shadow-sm"
          >
            Add category
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddSubCategoryModal(true)}
            className="shadow-sm"
          >
            Add sub category
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddProductModal(true)}
            className="shadow-sm"
          >
            Add product
          </Button>
        </div>
      </div>

      {/* Results Info Bar */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-gray-600">
          {!initialized ? (
            <span className="animate-pulse">Loading products...</span>
          ) : loading ? (
            <span className="animate-pulse">Updating products...</span>
          ) : (
            <span className="font-medium">
              Showing {products.length} of {pagination.total} products
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select 
            value={filters.limit}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid 
        products={products}
        loading={loading && !initialized}
        onAddToWishlist={handleAddToWishlist}
        onViewDetails={handleViewDetails}
        emptyMessage={
          filters.search 
            ? `No products found for "${filters.search}"` 
            : filters.category 
            ? `No products found in ${filters.category.name}${filters.subcategories?.length > 0 ? ` - ${filters.subcategories.map(s => s.name).join(', ')}` : ''}` 
            : 'No products available. Start by adding a product!'
        }
      />

      {/* Pagination */}
      {initialized && !loading && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={pagination.current}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={pagination.limit}
            totalItems={pagination.total}
          />
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        title="Add Product"
        size="lg"
      >
        <ProductForm
          onSuccess={handleProductSuccess}
          onCancel={() => setShowAddProductModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        title="Add Category"
        size="md"
      >
        <CategoryForm
          onSuccess={handleCategorySuccess}
          onCancel={() => setShowAddCategoryModal(false)}
        />
      </Modal>

      <Modal
        isOpen={showAddSubCategoryModal}
        onClose={() => setShowAddSubCategoryModal(false)}
        title="Add Sub Category"
        size="md"
      >
        <SubCategoryForm
          onSuccess={handleSubCategorySuccess}
          onCancel={() => setShowAddSubCategoryModal(false)}
        />
      </Modal>

      {/* Animation styles */}
      <style jsx>{`
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Home;