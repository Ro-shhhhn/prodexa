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
  selectedSubCategories
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar at top */}
      <Navbar onSearch={onSearch} />
      
      {/* Main Content Area - Fixed for proper scrolling */}
      <div className="pt-16 flex">
        {/* Fixed Sidebar */}
        {showSidebar && (
          <div className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto z-20">
            <Sidebar
              onCategoryFilter={onCategoryFilter}
              onSubCategoryFilter={onSubCategoryFilter}
              selectedCategory={selectedCategory}
              selectedSubCategories={selectedSubCategories}
            />
          </div>
        )}
        
        {/* Main Content - Fixed to allow full page scroll */}
        <div className={`flex-1 ${showSidebar ? 'ml-64' : ''} min-h-[calc(100vh-4rem)]`}>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;