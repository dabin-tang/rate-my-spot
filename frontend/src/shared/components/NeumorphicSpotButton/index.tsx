import React from 'react';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './NeumorphicSpotButton.module.scss';

export const NeumorphicSpotButton: React.FC = () => {
  const handleClick = () => {
    message.info({ 
      content: 'The Spot feature is currently under development.', 
      duration: 3, 
      style: { marginTop: '10vh' } 
    });
  };

  return (
    <button 
      className={styles.button}
      onClick={handleClick}
    >
      <PlusOutlined style={{ fontSize: '14px', strokeWidth: 10, stroke: 'currentColor' }} />
      <span>Spot</span>
    </button>
  );
};
