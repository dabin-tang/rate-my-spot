import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useGlobalSearch } from './useGlobalSearch';
import { SpotListDrawer } from '../../../features/spots/components/SpotListDrawer';
import { SpotDetailCard } from '../../../features/spots/components/SpotDetailCard';
import { useState } from 'react';
import styles from './Layout.module.scss';

const { Content, Header } = AntLayout;

const Layout: React.FC = () => {
  const location = useLocation();
  const {
    keyword,
    results,
    isDropdownVisible,
    isLoading,
    dropdownRef,
    handleInputChange,
    handleFocus,
    handleResultClick,
  } = useGlobalSearch();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);

  const handleSpotSelect = (spotId: number) => {
    setSelectedSpotId(spotId);
  };

  const handleCloseDetail = () => {
    setSelectedSpotId(null);
  };

  return (
    <AntLayout className={styles.layout}>
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <AntLayout className={styles.mainLayout}>
        <Header className={styles.header}>
          <div className={styles.searchContainer} ref={dropdownRef}>
            <Input
              className={styles.searchInput}
              placeholder="Search posts or spots..."
              prefix={<SearchOutlined style={{ color: '#0066ff' }} />}
              value={keyword}
              onChange={handleInputChange}
              onFocus={handleFocus}
              allowClear
            />
            
            {isDropdownVisible && keyword.trim() !== '' && (
              <div className={styles.searchDropdown}>
                {isLoading ? (
                  <div className={styles.dropdownState}><Spin size="small" /> Loading...</div>
                ) : results.length > 0 ? (
                  <ul className={styles.resultList}>
                    {results.map((spot) => (
                      <li 
                        key={spot.id} 
                        className={styles.resultItem}
                        onClick={() => handleResultClick(spot.id)}
                      >
                        <div className={styles.spotName}>{spot.name}</div>
                        <div className={styles.spotAddress}>{spot.address}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.dropdownState}>No results found</div>
                )}
              </div>
            )}
          </div>
          
          <div className={styles.headerRight}>
            <button 
              className={styles.spotButton} 
              onClick={() => setIsDrawerOpen(true)}
            >
              <span className={styles.spotIcon}>□</span> Spot
            </button>
          </div>
        </Header>

        <Content className={styles.content}>
          {/* Child routes matching the URL will render here, animated on location change */}
          <div key={location.pathname} className={styles.pageTransitionContainer}>
            <Outlet />
          </div>

          <SpotListDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
            onSpotSelect={handleSpotSelect}
          />

          <SpotDetailCard 
            spotId={selectedSpotId}
            isOpen={!!selectedSpotId}
            onClose={handleCloseDetail}
          />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
