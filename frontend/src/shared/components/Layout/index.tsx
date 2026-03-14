import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import styles from './Layout.module.scss';

const { Content } = AntLayout;

const Layout: React.FC = () => {
  const location = useLocation();

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
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
