// src/pages/Home.jsx
import React, { useState } from 'react';
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
    filters,
    pagination,
    updateFilters,
    updatePage,
    addProduct,
    addCategory,
    addSubCategory
  } = useProduct();

  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);

  // Event handlers
  const handleSearch = (term) => {
    updateFilters({ search: term });
  };

  const handleCategoryFilter = (category) => {
    updateFilters({ 
      category: category, 
      subcategory: null // Reset subcategory when category changes
    });
  };

  const handleSubCategoryFilter = (subCategory) => {
    updateFilters({ subcategory: subCategory });
  };

  const handlePageChange = (page) => {
    updatePage(page);
    window.scrollTo(0, 0);
  };

  const handleItemsPerPageChange = (newLimit) => {
    updateFilters({ limit: newLimit });
  };

  const handleAddToWishlist = async (product) => {
    try {
      console.log('Added to wishlist:', product.name);
      // TODO: Implement wishlist API call
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const handleViewDetails = (product) => {
    console.log('View details:', product.name);
    // TODO: Navigate to product details page
  };

  const handleOpenWishlist = () => {
    console.log('Open wishlist');
    // TODO: Navigate to wishlist page
  };

  // Modal handlers
  const handleProductSuccess = async (newProduct) => {
    try {
      await addProduct(newProduct);
      setShowAddProductModal(false);
      // Show success message
      console.log('Product added successfully:', newProduct.name);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleCategorySuccess = async (newCategory) => {
    try {
      await addCategory(newCategory);
      setShowAddCategoryModal(false);
      console.log('Category added successfully:', newCategory.name);
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  };

  const handleSubCategorySuccess = async (newSubCategory) => {
    try {
      await addSubCategory(newSubCategory.category, newSubCategory);
      setShowAddSubCategoryModal(false);
      console.log('Sub category added successfully:', newSubCategory.name);
    } catch (error) {
      console.error('Failed to add sub category:', error);
    }
  };

  return (
    <Layout
      onSearch={handleSearch}
      onOpenWishlist={handleOpenWishlist}
      onCategoryFilter={handleCategoryFilter}
      onSubCategoryFilter={handleSubCategoryFilter}
      selectedCategory={filters.category}
      selectedSubCategory={filters.subcategory}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {filters.category 
              ? `${filters.category.name}${filters.subcategory ? ` - ${filters.subcategory.name}` : ''}` 
              : 'All Products'
            }
          </h1>
          <nav className="flex text-sm text-gray-500">
            <span>Home</span>
            {filters.category && (
              <>
                <span className="mx-2">/</span>
                <span>{filters.category.name}</span>
              </>
            )}
            {filters.subcategory && (
              <>
                <span className="mx-2">/</span>
                <span>{filters.subcategory.name}</span>
              </>
            )}
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddCategoryModal(true)}
          >
            Add category
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddSubCategoryModal(true)}
          >
            Add sub category
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddProductModal(true)}
          >
            Add product
          </Button>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {loading ? (
            'Loading products...'
          ) : (
            `${pagination.total} of ${pagination.total} items`
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Show:</span>
          <select 
            value={filters.limit}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
            <option value={50}>50 rows</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <ProductGrid 
        products={products}
        loading={loading}
        onAddToWishlist={handleAddToWishlist}
        onViewDetails={handleViewDetails}
        emptyMessage={
          filters.search 
            ? `No products found for "${filters.search}"` 
            : filters.category 
            ? `No products found in ${filters.category.name}${filters.subcategory ? ` - ${filters.subcategory.name}` : ''}` 
            : 'No products available'
        }
      />

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="mt-8">
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
    </Layout>
  );
};

export default Home;