import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

const Message = ({ variant = 'info', children }) => {
  const styles = {
    info: { bg: '#dbeafe', color: '#1e40af', icon: <Info size={20} /> },
    success: { bg: '#dcfce3', color: '#166534', icon: <CheckCircle size={20} /> },
    danger: { bg: '#fee2e2', color: '#991b1b', icon: <XCircle size={20} /> },
    warning: { bg: '#fef3c7', color: '#854d0e', icon: <AlertCircle size={20} /> },
  };

  const current = styles[variant] || styles.info;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      backgroundColor: current.bg,
      color: current.color,
      margin: '16px 0',
      fontSize: '0.95rem',
      fontWeight: '500'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {current.icon}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Message;