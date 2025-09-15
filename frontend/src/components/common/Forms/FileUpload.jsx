// src/components/common/Forms/FileUpload.jsx
import React, { useRef } from 'react';
import Button from '../UI/Button';

const FileUpload = ({
  onFileSelect,
  accept = "*",
  multiple = false,
  disabled = false,
  className = "",
  children
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
    }
    // Reset input to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {children ? (
        <div onClick={handleClick} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button
          type="button"
          variant="secondary"
          onClick={handleClick}
          disabled={disabled}
        >
          Choose Files
        </Button>
      )}
    </div>
  );
};

export default FileUpload;