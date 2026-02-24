import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const { Content } = AntLayout;

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <style>{`
        body { margin: 0; padding: 0; overflow: hidden; }
        @keyframes pageFadeIn {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .page-transition-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          animation: pageFadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          overflow: hidden;
          height: 100%;
        }
      `}</style>
      <AntLayout style={{ height: '100vh', background: '#f8f8f8', overflow: 'hidden' }}>
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <AntLayout style={{ background: 'transparent' }}>
        <Content 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100vh',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Child routes matching the URL will render here, animated on location change */}
          <div key={location.pathname} className="page-transition-container">
            <Outlet />
          </div>
        </Content>
      </AntLayout>
      </AntLayout>
    </>
  );
};

export default Layout;
