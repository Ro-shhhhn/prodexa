// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout/Layout';
import ProductGrid from '../components/Product/ProductGrid';
import Pagination from '../components/common/UI/Pagination';
import Button from '../components/common/UI/Button';
import Modal from '../components/common/UI/Modal';
import productService from '../services/productService';

const Home = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSubCategoryModal, setShowAddSubCategoryModal] = useState(false);

  // Fetch products on component mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, selectedCategory, selectedSubCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory._id }),
        ...(selectedSubCategory && { subcategory: selectedSubCategory._id })
      };
      
      const response = await productService.getAllProducts(params);
      
      if (response.success) {
        setProducts(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback mock data for development
      setProducts(generateMockProducts());
      setTotalPages(5);
      setTotalItems(46);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock products for development
  const generateMockProducts = () => {
    const mockProducts = [];
    for (let i = 1; i <= 6; i++) {
      mockProducts.push({
        _id: `product-${i}`,
        name: `HP AMD Ryzen 3 ${i}`,
        price: 529.99,
        originalPrice: i % 2 === 0 ? 599.99 : undefined,
        rating: 4.2,
        reviewCount: 128,
        images: [`https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=HP+AMD+Ryzen+3+${i}`],
        variants: [
          { ram: '8GB', price: 529.99, quantity: 10 },
          { ram: '16GB', price: 629.99, quantity: 5 }
        ],
        quantity: 15,
        category: selectedCategory?._id || 'laptop',
        subcategory: selectedSubCategory?._id || 'hp'
      });
    }
    return mockProducts;
  };

  // Event handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null); // Reset subcategory when category changes
    setCurrentPage(1);
  };

  const handleSubCategoryFilter = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleAddToWishlist = async (product) => {
    try {
      // TODO: Implement wishlist API call
      console.log('Added to wishlist:', product.name);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const handleViewDetails = (product) => {
    console.log('View details:', product.name);
    // TODO: Navigate to product details page or open modal
  };

  const handleOpenWishlist = () => {
    console.log('Open wishlist');
    // TODO: Navigate to wishlist page or open modal
  };

  return (
    <Layout
      onSearch={handleSearch}
      onOpenWishlist={handleOpenWishlist}
      onCategoryFilter={handleCategoryFilter}
      onSubCategoryFilter={handleSubCategoryFilter}
      selectedCategory={selectedCategory}
      selectedSubCategory={selectedSubCategory}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedCategory 
              ? `${selectedCategory.name}${selectedSubCategory ? ` - ${selectedSubCategory.name}` : ''}` 
              : 'All Products'
            }
          </h1>
          <nav className="flex text-sm text-gray-500">
            <span>Home</span>
            {selectedCategory && (
              <>
                <span className="mx-2">/</span>
                <span>{selectedCategory.name}</span>
              </>
            )}
            {selectedSubCategory && (
              <>
                <span className="mx-2">/</span>
                <span>{selectedSubCategory.name}</span>
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
            `${totalItems} of ${totalItems} items`
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Show:</span>
          <select 
            value={itemsPerPage}
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
          searchTerm 
            ? `No products found for "${searchTerm}"` 
            : selectedCategory 
            ? `No products found in ${selectedCategory.name}${selectedSubCategory ? ` - ${selectedSubCategory.name}` : ''}` 
            : 'No products available'
        }
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
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
        <div className="text-center py-8">
          <p className="text-gray-600">Product form will be implemented here</p>
        </div>
      </Modal>

      <Modal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        title="Add Category"
        size="md"
      >
        <div className="text-center py-8">
          <p className="text-gray-600">Category form will be implemented here</p>
        </div>
      </Modal>

      <Modal
        isOpen={showAddSubCategoryModal}
        onClose={() => setShowAddSubCategoryModal(false)}
        title="Add Sub Category"
        size="md"
      >
        <div className="text-center py-8">
          <p className="text-gray-600">Sub category form will be implemented here</p>
        </div>
      </Modal>
    </Layout>
  );
};

export default Home;