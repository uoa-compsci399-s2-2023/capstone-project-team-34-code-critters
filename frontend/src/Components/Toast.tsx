import React, { useState, useEffect } from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const alertClass = type === 'success' ? 'alert-success' : 'bg-red-400';

  return visible ? (
    <div className="toast toast-top toast-end z-40">
      <div className={`border-none alert ${alertClass}`}>
        <span>{message}</span>
        <button type="button" onClick={() => setVisible(false)}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  ) : null;
}

export default Toast;
