import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { SpotListDrawer } from '../../../features/spots/components/SpotListDrawer';
import { SpotDetailCard } from '../../../features/spots/components/SpotDetailCard';
import { PostDetailModal } from '../../../features/posts/components/PostDetailModal';
import { useUIStore } from '../../stores/useUIStore';
import styles from './Layout.module.scss';

const { Content } = AntLayout;

const Layout: React.FC = () => {
  const location = useLocation();

  const isDrawerOpen = useUIStore((state) => state.isDrawerOpen);
  const selectedSpotId = useUIStore((state) => state.selectedSpotId);
  const setDrawerOpen = useUIStore((state) => state.setDrawerOpen);
  const setSelectedSpotId = useUIStore((state) => state.setSelectedSpotId);

  const handleSpotSelect = (spotId: number) => {
    setSelectedSpotId(spotId);
  };

  const handleCloseDetail = () => {
    setSelectedSpotId(null);
  };

  const selectedPostId = useUIStore((state) => state.selectedPostId);
  const setSelectedPostId = useUIStore((state) => state.setSelectedPostId);

  return (
    <AntLayout className={styles.layout}>
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <AntLayout className={styles.mainLayout}>
        <Content className={styles.content}>
          {/* Child routes matching the URL will render here, animated on location change */}
          <div key={location.pathname} className={styles.pageTransitionContainer}>
            <Outlet />
          </div>

          <SpotListDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setDrawerOpen(false)} 
            onSpotSelect={handleSpotSelect}
          />

          <SpotDetailCard 
            spotId={selectedSpotId}
            isOpen={!!selectedSpotId}
            onClose={handleCloseDetail}
          />
          <PostDetailModal 
            key={selectedPostId || 'close'}
            postId={selectedPostId}
            visible={!!selectedPostId} 
            onClose={() => setSelectedPostId(null)} 
          />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
