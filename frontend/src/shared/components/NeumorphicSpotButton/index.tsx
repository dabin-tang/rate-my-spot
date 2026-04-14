import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useUIStore } from '../../stores/useUIStore';
import styles from './NeumorphicSpotButton.module.scss';

export const NeumorphicSpotButton: React.FC = () => {
  const isDrawerOpen = useUIStore((state) => state.isDrawerOpen);
  const setDrawerOpen = useUIStore((state) => state.setDrawerOpen);

  const handleClick = () => {
    setDrawerOpen(!isDrawerOpen);
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
