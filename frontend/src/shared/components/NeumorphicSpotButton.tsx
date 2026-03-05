import React from 'react';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export const NeumorphicSpotButton: React.FC = () => {
  return (
    <>
      <style>{`
        .neumorphic-spot-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 26px;
          background-color: #e0e0e0;
          color: #333;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          outline: none;
          box-shadow: 
            -6px -6px 14px rgba(255, 255, 255, 0.9),
            6px 6px 14px rgba(0, 0, 0, 0.15),
            inset 1px 1px 2px rgba(255, 255, 255, 0.8),
            inset -1px -1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease-in-out;
          user-select: none;
          letter-spacing: 0.3px;
          -webkit-tap-highlight-color: transparent;
        }
        
        .neumorphic-spot-btn:hover {
          color: #111;
        }

        .neumorphic-spot-btn:active {
          box-shadow: 
            inset 6px 6px 12px rgba(0, 0, 0, 0.25),
            inset -6px -6px 12px rgba(255, 255, 255, 0.9);
          color: #000;
          transform: scale(0.97) translateY(2px);
        }
      `}</style>
      <button 
        className="neumorphic-spot-btn"
        onClick={() => message.info({ content: 'The Spot feature is currently under development.', duration: 3, style: { marginTop: '10vh' } })}
      >
        <PlusOutlined style={{ fontSize: '14px', strokeWidth: 10, stroke: 'currentColor' }} />
        <span>Spot</span>
      </button>
    </>
  );
};
