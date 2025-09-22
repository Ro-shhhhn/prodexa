// src/components/common/Layout/Layout.jsx
import React from 'react';
import Navbar from '../Header/Navbar';
import Sidebar from './Sidebar';

const Layout = ({ 
  children, 
  showSidebar = true, 
  onSearch,
  onCategoryFilter,
  onSubCategoryFilter,
  selectedCategory,
  selectedSubCategory
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar 
        onSearch={onSearch}
      />
      
      {/* Main Content Area */}
      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200">
            <Sidebar
              onCategoryFilter={onCategoryFilter}
              onSubCategoryFilter={onSubCategoryFilter}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
            />
          </div>
        )}
        
        {/* Main Content */}
        <div className={`flex-1 ${showSidebar ? 'ml-64' : ''}`}>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;