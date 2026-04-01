import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 40, color = 'var(--info-blue)', text = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <Loader2 
        size={size} 
        color={color} 
        style={{ animation: 'spin 1s linear infinite' }} 
      />
      {text && <span style={{ marginTop: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</span>}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;