import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative transform transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900" style={{ fontSize: '16px' }}>
          <FaTimes />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
