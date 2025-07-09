import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  message,
  buttonText,
  onButtonClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full mx-4 text-center">
        <p className="text-lg font-semibold text-gray-800 mb-6">{message}</p>
        <button
          onClick={onButtonClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;
