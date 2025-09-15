// src/components/common/UI/Pagination.jsx
import React from 'react';
import Button from './Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage = 10,
  totalItems = 0,
  showItemsInfo = true 
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6">
      {showItemsInfo && (
        <div className="flex flex-1 justify-between sm:hidden">
          <span className="text-sm text-gray-700">
            {startItem} of {totalItems} items
          </span>
        </div>
      )}
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {showItemsInfo && (
          <div>
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{startItem}</span> to{' '}
              <span className="font-medium">{endItem}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </span>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1"
          >
            Previous
          </Button>
          
          {/* Page numbers */}
          <div className="flex space-x-1">
            {visiblePages[0] > 1 && (
              <>
                <Button
                  variant={1 === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  className="px-3 py-1 min-w-[40px]"
                >
                  1
                </Button>
                {visiblePages[0] > 2 && (
                  <span className="px-2 py-1 text-gray-500">...</span>
                )}
              </>
            )}
            
            {visiblePages.map(page => (
              <Button
                key={page}
                variant={page === currentPage ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="px-3 py-1 min-w-[40px]"
              >
                {page}
              </Button>
            ))}
            
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="px-2 py-1 text-gray-500">...</span>
                )}
                <Button
                  variant={totalPages === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  className="px-3 py-1 min-w-[40px]"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          {/* Next button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1"
          >
            Next
          </Button>
        </div>
      </div>
      
      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="flex items-center text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;