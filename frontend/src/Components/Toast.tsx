import React, { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error' | string;
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000); // Adjust the duration (in milliseconds) as needed

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const alertClass = type ? `alert bg-${type}` : 'alert';

  return visible ? (
    <div className="toast">
      <div className={`${alertClass}`}>
        <span>{message}</span>
        <button type="button" onClick={() => setVisible(false)}>
          &times;
        </button>
      </div>
    </div>
  ) : null;
}

export default Toast;
