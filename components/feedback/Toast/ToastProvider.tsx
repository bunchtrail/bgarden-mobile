import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Toast } from './Toast';
import { View } from 'react-native';

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastPosition = 'top' | 'bottom';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
  position: ToastPosition;
}

interface ToastContextProps {
  showToast: (message: string, options?: Partial<Omit<ToastState, 'visible' | 'message'>>) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
    duration: 3000,
    position: 'bottom',
  });

  const showToast = useCallback((message: string, options?: Partial<Omit<ToastState, 'visible' | 'message'>>) => {
    setToast({
      visible: true,
      message,
      type: options?.type || 'info',
      duration: options?.duration || 3000,
      position: options?.position || 'bottom',
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        position={toast.position}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export default ToastProvider; 