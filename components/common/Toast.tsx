import React, { useState, useEffect } from 'react';
import notificationService, { ToastMessage } from '../../services/notificationService';

const Toast = ({ message, type, onClose }: ToastMessage & { onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: '✓',
    error: '✖',
    info: 'ℹ',
  };

  return (
    <div className={`toast-item toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <p className="toast-message">{message}</p>
      <button className="toast-close" onClick={onClose}>&times;</button>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.onToast((newToast) => {
      setToasts(currentToasts => [...currentToasts, newToast]);
    });
    return () => unsubscribe();
  }, []);

  const removeToast = (id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  };

  return (
    <div className="toast-container" aria-live="assertive">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

export default ToastContainer;
